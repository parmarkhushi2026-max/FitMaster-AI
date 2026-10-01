/**
 * ============================================================================
 * FITMASTER AI — LIVE AI VISION POSE COACH & REAL-TIME REP COUNTER
 * Powered by Google MediaPipe Pose & Kinetic Biomechanical Angle Engine
 * ============================================================================
 */

(function () {
    'use strict';

    // State
    const state = {
        exercise: 'squats',      // 'squats', 'curls', 'pushups', 'jacks'
        repCount: 0,
        targetReps: 15,
        exerciseState: 'up',     // 'up' or 'down'
        currentAngle: 180,
        calories: 0,
        formScore: 100,
        goodReps: 0,
        startTime: null,
        timerInterval: null,
        isRunning: false,
        isDemoMode: false,
        voiceEnabled: true,
        soundEnabled: true,
        cameraFacing: 'user',    // 'user' or 'environment'
        demoFrameId: null,
        demoPhase: 0,
    };

    // Exercise Biomechanical Thresholds & MET values
    const EXERCISE_CONFIG = {
        squats: {
            name: 'Squats',
            jointName: 'Knee Angle',
            unitKcal: 0.32,
            targetDepth: 95,
            standThreshold: 155,
            guidanceUp: 'Stand tall & brace your core',
            guidanceDown: 'Squat down until thighs parallel!',
            successFeedback: 'Perfect squat depth!',
            downTip: 'Push through heels on the way up!',
        },
        curls: {
            name: 'Bicep Curls',
            jointName: 'Elbow Angle',
            unitKcal: 0.22,
            targetDepth: 45,
            standThreshold: 145,
            guidanceUp: 'Lower weights smoothly for full stretch',
            guidanceDown: 'Squeeze biceps at the top!',
            successFeedback: 'Full contraction achieved!',
            downTip: 'Controlled eccentric return!',
        },
        pushups: {
            name: 'Push-Ups',
            jointName: 'Elbow Angle',
            unitKcal: 0.28,
            targetDepth: 85,
            standThreshold: 150,
            guidanceUp: 'Lock out elbows & keep back rigid',
            guidanceDown: 'Lower chest close to floor!',
            successFeedback: 'Great pushup depth!',
            downTip: 'Explode up through your palms!',
        },
        jacks: {
            name: 'Jumping Jacks',
            jointName: 'Arm Elevation',
            unitKcal: 0.20,
            targetDepth: 140,
            standThreshold: 50,
            guidanceUp: 'Jump back, arms to sides',
            guidanceDown: 'Clap hands overhead, spread feet!',
            successFeedback: 'High energy pace!',
            downTip: 'Keep bouncing on balls of feet!',
        },
    };

    // DOM Elements
    let videoEl, canvasEl, ctx;
    let repNumEl, currentAngleEl, angleBarFill, angleJointNameEl;
    let caloriesValEl, timeValEl, formScoreValEl;
    let feedbackBanner, feedbackTitle, feedbackDesc, feedbackBadge;
    let camPlaceholder;
    let cameraInstance = null;
    let poseDetector = null;

    // Web Audio Synthesizer
    let audioCtx = null;
    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playBeep(type = 'rep') {
        if (!state.soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;
            if (type === 'rep') {
                // Energetic double chime
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(587.33, now); // D5
                osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.12); // A5
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
            } else if (type === 'warning') {
                // Lower reminder tone
                osc.type = 'sine';
                osc.frequency.setValueAtTime(320, now);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
            }
        } catch (e) {
            // Audio policy blocked
        }
    }

    function speakText(text) {
        if (!state.voiceEnabled || !window.speechSynthesis) return;
        try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.1;
            utterance.pitch = 1.0;
            utterance.volume = 0.9;
            window.speechSynthesis.speak(utterance);
        } catch (e) {}
    }

    // Mathematical Angle Calculator: 3 Landmark Points (A, B, C)
    function calculateAngle(a, b, c) {
        if (!a || !b || !c) return 180;
        const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
        let angle = Math.abs((radians * 180.0) / Math.PI);
        if (angle > 180.0) {
            angle = 360.0 - angle;
        }
        return Math.round(angle);
    }

    // Distance between 2 Points
    function calculateDistance(p1, p2) {
        if (!p1 || !p2) return 0;
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Initialize DOM References
    function initDOM() {
        videoEl = document.getElementById('coachVideo');
        canvasEl = document.getElementById('coachCanvas');
        if (canvasEl) ctx = canvasEl.getContext('2d');

        repNumEl = document.getElementById('repNumDisplay');
        currentAngleEl = document.getElementById('currentAngleDisplay');
        angleBarFill = document.getElementById('angleBarFill');
        angleJointNameEl = document.getElementById('angleJointName');

        caloriesValEl = document.getElementById('caloriesVal');
        timeValEl = document.getElementById('timeVal');
        formScoreValEl = document.getElementById('formScoreVal');

        feedbackBanner = document.getElementById('feedbackBanner');
        feedbackTitle = document.getElementById('feedbackTitle');
        feedbackDesc = document.getElementById('feedbackDesc');
        feedbackBadge = document.getElementById('feedbackBadge');

        camPlaceholder = document.getElementById('camPlaceholder');

        // Setup exercise buttons
        document.querySelectorAll('.exercise-pill').forEach(btn => {
            btn.addEventListener('click', function () {
                const ex = this.getAttribute('data-exercise');
                switchExercise(ex);
            });
        });

        // Setup control buttons
        const startBtn = document.getElementById('btnStartCoach');
        if (startBtn) startBtn.addEventListener('click', toggleCameraStart);

        const demoBtn = document.getElementById('btnDemoMode');
        if (demoBtn) demoBtn.addEventListener('click', toggleDemoMode);

        const resetBtn = document.getElementById('btnResetCoach');
        if (resetBtn) resetBtn.addEventListener('click', resetSession);

        const finishBtn = document.getElementById('btnFinishWorkout');
        if (finishBtn) finishBtn.addEventListener('click', finishWorkout);

        // Sound & Voice toggles
        const voiceToggle = document.getElementById('toggleVoice');
        if (voiceToggle) {
            voiceToggle.addEventListener('change', e => {
                state.voiceEnabled = e.target.checked;
                if (state.voiceEnabled) speakText("AI Voice coach enabled");
            });
        }

        const soundToggle = document.getElementById('toggleSound');
        if (soundToggle) {
            soundToggle.addEventListener('change', e => {
                state.soundEnabled = e.target.checked;
                if (state.soundEnabled) playBeep('rep');
            });
        }

        // Mirror Toggle
        const mirrorBtn = document.getElementById('btnToggleMirror');
        if (mirrorBtn) {
            mirrorBtn.addEventListener('click', () => {
                const isMirrored = videoEl.style.transform === 'none';
                videoEl.style.transform = isMirrored ? 'scaleX(-1)' : 'none';
                canvasEl.style.transform = isMirrored ? 'scaleX(-1)' : 'none';
                mirrorBtn.classList.toggle('active', !isMirrored);
            });
        }
    }

    // Switch Exercise Routine
    function switchExercise(exerciseKey) {
        if (!EXERCISE_CONFIG[exerciseKey]) return;
        state.exercise = exerciseKey;
        state.exerciseState = 'up';

        // Update pills
        document.querySelectorAll('.exercise-pill').forEach(p => {
            p.classList.toggle('active', p.getAttribute('data-exercise') === exerciseKey);
        });

        const cfg = EXERCISE_CONFIG[exerciseKey];
        if (angleJointNameEl) angleJointNameEl.textContent = cfg.jointName;
        updateFeedback(cfg.name, cfg.guidanceUp, 'Ready');
        speakText(cfg.name + " selected. Get in position!");
    }

    // Toggle Camera Start / Stop
    async function toggleCameraStart() {
        if (state.isDemoMode) stopDemo();

        if (state.isRunning) {
            stopCamera();
            return;
        }

        try {
            startTimer();
            if (camPlaceholder) camPlaceholder.style.display = 'none';

            const startBtn = document.getElementById('btnStartCoach');
            if (startBtn) {
                startBtn.innerHTML = '<i class="fa-solid fa-stop"></i> Stop Camera';
                startBtn.style.background = 'linear-gradient(135deg, #ef4444, #b91c1c)';
            }

            const vpBadge = document.getElementById('viewportLiveBadge');
            if (vpBadge) {
                vpBadge.innerHTML = '<span class="pulse-dot" style="background:#30d158;"></span> LIVE CAMERA';
                vpBadge.classList.add('live-active');
            }

            state.isRunning = true;
            await initMediaPipe();
        } catch (err) {
            console.warn("Camera init failed, launching simulation:", err);
            toggleDemoMode();
        }
    }

    function stopCamera() {
        state.isRunning = false;
        if (cameraInstance) {
            try { cameraInstance.stop(); } catch (e) {}
            cameraInstance = null;
        }

        if (videoEl && videoEl.srcObject) {
            const tracks = videoEl.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoEl.srcObject = null;
        }

        const startBtn = document.getElementById('btnStartCoach');
        if (startBtn) {
            startBtn.innerHTML = '<i class="fa-solid fa-camera"></i> Start Camera';
            startBtn.style.background = '';
        }

        const vpBadge = document.getElementById('viewportLiveBadge');
        if (vpBadge) {
            vpBadge.innerHTML = '<span class="pulse-dot"></span> CAMERA OFF';
            vpBadge.classList.remove('live-active');
        }

        if (camPlaceholder) camPlaceholder.style.display = 'flex';
        clearCanvas();
        stopTimer();
    }

    // Initialize MediaPipe Pose
    async function initMediaPipe() {
        if (typeof window.Pose === 'undefined') {
            console.warn("MediaPipe Pose CDN not loaded, switching to smart demo simulator");
            toggleDemoMode();
            return;
        }

        poseDetector = new window.Pose({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });

        poseDetector.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        poseDetector.onResults(onPoseResults);

        if (typeof window.Camera !== 'undefined') {
            cameraInstance = new window.Camera(videoEl, {
                onFrame: async () => {
                    if (state.isRunning && poseDetector) {
                        await poseDetector.send({ image: videoEl });
                    }
                },
                width: 640,
                height: 480,
            });
            await cameraInstance.start();
        } else {
            // Direct getUserMedia fallback
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: state.cameraFacing },
                audio: false,
            });
            videoEl.srcObject = stream;
            await videoEl.play();

            const processLoop = async () => {
                if (state.isRunning && poseDetector) {
                    await poseDetector.send({ image: videoEl });
                    requestAnimationFrame(processLoop);
                }
            };
            requestAnimationFrame(processLoop);
        }
    }

    // Pose Detection Results Processor
    function onPoseResults(results) {
        if (!canvasEl || !ctx) return;

        // Ensure canvas matches video resolution
        if (canvasEl.width !== results.image.width || canvasEl.height !== results.image.height) {
            canvasEl.width = results.image.width;
            canvasEl.height = results.image.height;
        }

        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

        if (!results.poseLandmarks) {
            updateFeedback('Finding Athlete...', 'Step back so your full body is visible in the frame.', 'Scanning');
            return;
        }

        const landmarks = results.poseLandmarks;
        drawSkeleton(landmarks);
        processBiometrics(landmarks);
    }

    // Biomechanical Analyzer & Rep Counter
    function processBiometrics(landmarks) {
        const cfg = EXERCISE_CONFIG[state.exercise];
        let angle = 180;
        let activeJointCoord = null;

        // Landmarks mapping based on MediaPipe:
        // 11/12 = Shoulders (L/R), 13/14 = Elbows (L/R), 15/16 = Wrists (L/R)
        // 23/24 = Hips (L/R), 25/26 = Knees (L/R), 27/28 = Ankles (L/R)
        if (state.exercise === 'squats') {
            // Track Left Leg (23 Hip, 25 Knee, 27 Ankle)
            const hip = landmarks[23];
            const knee = landmarks[25];
            const ankle = landmarks[27];
            angle = calculateAngle(hip, knee, ankle);
            activeJointCoord = knee;

            if (angle <= cfg.targetDepth && state.exerciseState === 'up') {
                state.exerciseState = 'down';
                updateFeedback('Good Depth!', cfg.downTip, 'DOWN');
            } else if (angle >= cfg.standThreshold && state.exerciseState === 'down') {
                state.exerciseState = 'up';
                recordRep(cfg);
            }
        } else if (state.exercise === 'curls') {
            // Track Right or Left arm based on visibility
            const shoulder = landmarks[14].visibility > landmarks[13].visibility ? landmarks[14] : landmarks[13];
            const elbow = landmarks[14].visibility > landmarks[13].visibility ? landmarks[16] : landmarks[15];
            const wrist = landmarks[14].visibility > landmarks[13].visibility ? landmarks[18] || landmarks[16] : landmarks[17] || landmarks[15];

            angle = calculateAngle(shoulder, elbow, wrist);
            activeJointCoord = elbow;

            if (angle <= cfg.targetDepth && state.exerciseState === 'down') {
                state.exerciseState = 'up';
                updateFeedback('Peak Contraction!', cfg.guidanceUp, 'UP');
                recordRep(cfg);
            } else if (angle >= cfg.standThreshold && state.exerciseState === 'up') {
                state.exerciseState = 'down';
                updateFeedback('Lowering Weight', cfg.guidanceDown, 'DOWN');
            }
        } else if (state.exercise === 'pushups') {
            const shoulder = landmarks[12];
            const elbow = landmarks[14];
            const wrist = landmarks[16];
            angle = calculateAngle(shoulder, elbow, wrist);
            activeJointCoord = elbow;

            if (angle <= cfg.targetDepth && state.exerciseState === 'up') {
                state.exerciseState = 'down';
                updateFeedback('Deep Pushup Depth!', cfg.downTip, 'DOWN');
            } else if (angle >= cfg.standThreshold && state.exerciseState === 'down') {
                state.exerciseState = 'up';
                recordRep(cfg);
            }
        } else if (state.exercise === 'jacks') {
            // Arm angle from torso
            const shoulder = landmarks[12];
            const wrist = landmarks[16];
            const hip = landmarks[24];
            angle = calculateAngle(hip, shoulder, wrist);
            activeJointCoord = shoulder;

            if (angle >= cfg.targetDepth && state.exerciseState === 'down') {
                state.exerciseState = 'up';
                recordRep(cfg);
                updateFeedback('Overhead Clap!', cfg.guidanceUp, 'UP');
            } else if (angle <= cfg.standThreshold && state.exerciseState === 'up') {
                state.exerciseState = 'down';
                updateFeedback('Arms In', cfg.guidanceDown, 'DOWN');
            }
        }

        state.currentAngle = angle;
        updateHUD(angle, activeJointCoord);
    }

    // Record Completed Rep
    function recordRep(cfg) {
        state.repCount += 1;
        state.goodReps += 1;
        state.calories += cfg.unitKcal;

        // Play Sound & Announce
        playBeep('rep');
        speakText(`${state.repCount}`);

        // Neon Pulse animation on big counter
        if (repNumEl) {
            repNumEl.textContent = state.repCount;
            repNumEl.classList.add('pulse');
            setTimeout(() => repNumEl.classList.remove('pulse'), 300);
        }

        // Progress Fill
        const pct = Math.min(100, Math.round((state.repCount / state.targetReps) * 100));
        const fillEl = document.getElementById('repProgressFill');
        if (fillEl) fillEl.style.width = pct + '%';

        // Update Calories
        if (caloriesValEl) caloriesValEl.textContent = state.calories.toFixed(1);

        // Praise Milestone
        if (state.repCount % 5 === 0) {
            setTimeout(() => speakText(`Awesome pace! ${state.repCount} reps done!`), 700);
        }

        updateFeedback(cfg.successFeedback, `Rep ${state.repCount} locked in!`, 'UP');
    }

    // Draw Cyberpunk Pose Skeleton on Canvas
    function drawSkeleton(landmarks) {
        if (!ctx || !canvasEl) return;

        const connections = [
            // Face & Torso
            [11, 12], [11, 23], [12, 24], [23, 24],
            // Arms
            [11, 13], [13, 15], [12, 14], [14, 16],
            // Legs
            [23, 25], [25, 27], [24, 26], [26, 28]
        ];

        // Draw connections with neon laser glow
        ctx.save();
        ctx.strokeStyle = '#0071e3';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#0071e3';
        ctx.shadowBlur = 12;

        connections.forEach(([i, j]) => {
            const p1 = landmarks[i];
            const p2 = landmarks[j];
            if (p1 && p2 && (p1.visibility || 1) > 0.4 && (p2.visibility || 1) > 0.4) {
                ctx.beginPath();
                ctx.moveTo(p1.x * canvasEl.width, p1.y * canvasEl.height);
                ctx.lineTo(p2.x * canvasEl.width, p2.y * canvasEl.height);
                ctx.stroke();
            }
        });

        // Draw glowing nodes
        landmarks.forEach((p, idx) => {
            if ([11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28].includes(idx)) {
                if ((p.visibility || 1) > 0.4) {
                    const cx = p.x * canvasEl.width;
                    const cy = p.y * canvasEl.height;

                    ctx.beginPath();
                    ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
                    ctx.fillStyle = '#30d158';
                    ctx.shadowColor = '#30d158';
                    ctx.shadowBlur = 15;
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(cx, cy, 2, 0, 2 * Math.PI);
                    ctx.fillStyle = '#ffffff';
                    ctx.fill();
                }
            }
        });

        ctx.restore();
    }

    // Update Telemetry HUD
    function updateHUD(angle, activeJointCoord) {
        if (currentAngleEl) currentAngleEl.textContent = `${angle}°`;

        // Update angle bar
        if (angleBarFill) {
            const pct = Math.min(100, Math.max(0, (angle / 180) * 100));
            angleBarFill.style.width = pct + '%';
            if (angle <= 95) {
                angleBarFill.style.backgroundColor = '#30d158'; // Green target
            } else if (angle <= 135) {
                angleBarFill.style.backgroundColor = '#ff9f0a'; // Transition
            } else {
                angleBarFill.style.backgroundColor = '#38bdf8'; // Standing
            }
        }

        // Draw live angle label directly on active joint on canvas
        if (activeJointCoord && ctx && canvasEl) {
            const jx = activeJointCoord.x * canvasEl.width;
            const jy = activeJointCoord.y * canvasEl.height;

            ctx.save();
            ctx.fillStyle = 'rgba(10, 12, 18, 0.85)';
            ctx.strokeStyle = '#30d158';
            ctx.lineWidth = 1.5;
            ctx.roundRect ? ctx.roundRect(jx + 12, jy - 16, 60, 28, 6) : ctx.rect(jx + 12, jy - 16, 60, 28);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#30d158';
            ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
            ctx.fillText(`${angle}°`, jx + 22, jy + 3);
            ctx.restore();
        }
    }

    // Update Feedback Banner
    function updateFeedback(title, desc, badge) {
        if (feedbackTitle) feedbackTitle.textContent = title;
        if (feedbackDesc) feedbackDesc.textContent = desc;
        if (feedbackBadge) {
            feedbackBadge.textContent = badge;
            feedbackBadge.className = 'feedback-state-badge ' + (badge.toLowerCase() === 'down' ? 'down' : 'up');
        }
    }

    // =========================================================================
    // SMART INTERACTIVE SIMULATION DEMO MODE
    // Allows instant testing even without webcam permissions!
    // =========================================================================

    function toggleDemoMode() {
        if (state.isDemoMode) {
            stopDemo();
            return;
        }

        if (state.isRunning) stopCamera();

        state.isDemoMode = true;
        startTimer();
        if (camPlaceholder) camPlaceholder.style.display = 'none';

        const demoBtn = document.getElementById('btnDemoMode');
        if (demoBtn) {
            demoBtn.innerHTML = '<i class="fa-solid fa-stop"></i> Stop Demo';
            demoBtn.style.borderColor = '#0071e3';
            demoBtn.style.color = '#38bdf8';
        }

        const vpBadge = document.getElementById('viewportLiveBadge');
        if (vpBadge) {
            vpBadge.innerHTML = '<span class="pulse-dot" style="background:#0071e3;"></span> SIMULATION ACTIVE';
            vpBadge.classList.add('live-active');
        }

        speakText("Starting interactive exercise simulation");
        runDemoLoop();
    }

    function stopDemo() {
        state.isDemoMode = false;
        if (state.demoFrameId) cancelAnimationFrame(state.demoFrameId);
        state.demoFrameId = null;

        const demoBtn = document.getElementById('btnDemoMode');
        if (demoBtn) {
            demoBtn.innerHTML = '<i class="fa-solid fa-play"></i> Try Demo Mode';
            demoBtn.style.borderColor = '';
            demoBtn.style.color = '';
        }

        const vpBadge = document.getElementById('viewportLiveBadge');
        if (vpBadge) {
            vpBadge.innerHTML = '<span class="pulse-dot"></span> SIMULATION STOPPED';
            vpBadge.classList.remove('live-active');
        }

        if (camPlaceholder) camPlaceholder.style.display = 'flex';
        clearCanvas();
        stopTimer();
    }

    function runDemoLoop() {
        if (!state.isDemoMode) return;

        if (canvasEl && (canvasEl.width === 0 || canvasEl.height === 0)) {
            canvasEl.width = 640;
            canvasEl.height = 480;
        }

        state.demoPhase += 0.045; // Smooth movement speed
        const t = (Math.sin(state.demoPhase) + 1) / 2; // Oscillate 0 to 1

        const cfg = EXERCISE_CONFIG[state.exercise];
        const minAngle = cfg.targetDepth - 5;
        const maxAngle = cfg.standThreshold + 10;
        const currentAngle = Math.round(maxAngle - t * (maxAngle - minAngle));

        // Generate synthetic landmarks for athlete visualization
        const syntheticLandmarks = generateSyntheticLandmarks(t, state.exercise);
        
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        
        // Draw simulated background & athletic grid
        drawSimulatedGrid();
        drawSkeleton(syntheticLandmarks);

        // Run state machine
        if (currentAngle <= cfg.targetDepth && state.exerciseState === 'up') {
            state.exerciseState = 'down';
            updateFeedback('Good Depth!', cfg.downTip, 'DOWN');
        } else if (currentAngle >= cfg.standThreshold && state.exerciseState === 'down') {
            state.exerciseState = 'up';
            recordRep(cfg);
        }

        state.currentAngle = currentAngle;
        updateHUD(currentAngle, syntheticLandmarks[state.exercise === 'curls' ? 14 : 25]);

        state.demoFrameId = requestAnimationFrame(runDemoLoop);
    }

    function drawSimulatedGrid() {
        if (!ctx || !canvasEl) return;
        ctx.save();
        ctx.fillStyle = '#0a0d14';
        ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

        // Cyberpunk grid floor
        ctx.strokeStyle = 'rgba(0, 113, 227, 0.15)';
        ctx.lineWidth = 1;
        for (let y = canvasEl.height * 0.65; y < canvasEl.height; y += 24) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvasEl.width, y);
            ctx.stroke();
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.font = '700 13px system-ui';
        ctx.fillText('FITMASTER VIRTUAL KINETIC SIMULATOR', 24, 36);
        ctx.restore();
    }

    function generateSyntheticLandmarks(progress, exercise) {
        const cx = 0.5;
        const cy = 0.45;
        const landmarks = [];
        for (let i = 0; i <= 32; i++) {
            landmarks.push({ x: cx, y: cy, visibility: 0.95 });
        }

        if (exercise === 'squats') {
            // Squatting down shifts hip & knees
            const hipY = 0.42 + progress * 0.18;
            const kneeY = 0.62 + progress * 0.08;
            const kneeX = cx - 0.06 - progress * 0.05;

            landmarks[11] = { x: cx - 0.1, y: hipY - 0.22, visibility: 1 };
            landmarks[12] = { x: cx + 0.1, y: hipY - 0.22, visibility: 1 };
            landmarks[23] = { x: cx - 0.08, y: hipY, visibility: 1 };
            landmarks[24] = { x: cx + 0.08, y: hipY, visibility: 1 };
            landmarks[25] = { x: kneeX, y: kneeY, visibility: 1 };
            landmarks[26] = { x: cx + 0.08, y: kneeY, visibility: 1 };
            landmarks[27] = { x: cx - 0.08, y: 0.88, visibility: 1 };
            landmarks[28] = { x: cx + 0.08, y: 0.88, visibility: 1 };
        } else if (exercise === 'curls') {
            // Arm curls up
            const wristY = 0.65 - progress * 0.32;
            landmarks[11] = { x: cx - 0.1, y: 0.25, visibility: 1 };
            landmarks[12] = { x: cx + 0.1, y: 0.25, visibility: 1 };
            landmarks[13] = { x: cx - 0.14, y: 0.45, visibility: 1 };
            landmarks[14] = { x: cx + 0.14, y: 0.45, visibility: 1 };
            landmarks[15] = { x: cx - 0.14, y: wristY, visibility: 1 };
            landmarks[16] = { x: cx + 0.14, y: wristY, visibility: 1 };
            landmarks[23] = { x: cx - 0.08, y: 0.52, visibility: 1 };
            landmarks[24] = { x: cx + 0.08, y: 0.52, visibility: 1 };
            landmarks[25] = { x: cx - 0.08, y: 0.72, visibility: 1 };
            landmarks[26] = { x: cx + 0.08, y: 0.72, visibility: 1 };
            landmarks[27] = { x: cx - 0.08, y: 0.9, visibility: 1 };
            landmarks[28] = { x: cx + 0.08, y: 0.9, visibility: 1 };
        } else {
            // General athletic posture
            landmarks[11] = { x: cx - 0.1, y: 0.25, visibility: 1 };
            landmarks[12] = { x: cx + 0.1, y: 0.25, visibility: 1 };
            landmarks[13] = { x: cx - 0.18, y: 0.42, visibility: 1 };
            landmarks[14] = { x: cx + 0.18, y: 0.42, visibility: 1 };
            landmarks[15] = { x: cx - 0.22, y: 0.62, visibility: 1 };
            landmarks[16] = { x: cx + 0.22, y: 0.62, visibility: 1 };
            landmarks[23] = { x: cx - 0.08, y: 0.52, visibility: 1 };
            landmarks[24] = { x: cx + 0.08, y: 0.52, visibility: 1 };
            landmarks[25] = { x: cx - 0.08, y: 0.72, visibility: 1 };
            landmarks[26] = { x: cx + 0.08, y: 0.72, visibility: 1 };
            landmarks[27] = { x: cx - 0.08, y: 0.9, visibility: 1 };
            landmarks[28] = { x: cx + 0.08, y: 0.9, visibility: 1 };
        }

        return landmarks;
    }

    // Timer & Session Helpers
    function startTimer() {
        if (state.timerInterval) clearInterval(state.timerInterval);
        state.startTime = Date.now();
        state.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
            const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
            const ss = String(elapsed % 60).padStart(2, '0');
            if (timeValEl) timeValEl.textContent = `${mm}:${ss}`;
        }, 1000);
    }

    function stopTimer() {
        if (state.timerInterval) clearInterval(state.timerInterval);
        state.timerInterval = null;
    }

    function resetSession() {
        state.repCount = 0;
        state.calories = 0;
        state.goodReps = 0;
        state.exerciseState = 'up';
        if (repNumEl) repNumEl.textContent = '0';
        if (caloriesValEl) caloriesValEl.textContent = '0.0';
        if (timeValEl) timeValEl.textContent = '00:00';
        const fillEl = document.getElementById('repProgressFill');
        if (fillEl) fillEl.style.width = '0%';
        stopTimer();
        if (state.isRunning || state.isDemoMode) startTimer();
        speakText("Session reset. Ready for rep one!");
    }

    function clearCanvas() {
        if (ctx && canvasEl) ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    }

    function finishWorkout() {
        if (state.isRunning) stopCamera();
        if (state.isDemoMode) stopDemo();

        const modal = document.getElementById('workoutSummaryModal');
        if (modal) {
            document.getElementById('modalTotalReps').textContent = state.repCount;
            document.getElementById('modalTotalKcal').textContent = state.calories.toFixed(1);
            document.getElementById('modalTotalTime').textContent = timeValEl ? timeValEl.textContent : '00:00';
            modal.classList.add('active');
            speakText(`Workout complete! You crushed ${state.repCount} reps and burned ${state.calories.toFixed(0)} calories!`);
        }
    }

    // Modal close
    window.closeWorkoutModal = function () {
        const modal = document.getElementById('workoutSummaryModal');
        if (modal) modal.classList.remove('active');
        resetSession();
    };

    // Auto-init on page load
    document.addEventListener('DOMContentLoaded', initDOM);

})();
