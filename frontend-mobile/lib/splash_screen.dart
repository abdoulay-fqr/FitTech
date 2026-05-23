import 'dart:math';
import 'package:flutter/material.dart';

// ─────────────────────────────────────────────
//  FITTECH ANIMATED SPLASH SCREEN
//  Place this file in lib/splash_screen.dart
// ─────────────────────────────────────────────

class FitTechSplashScreen extends StatefulWidget {
  final Widget nextScreen; // screen to transition into
  const FitTechSplashScreen({super.key, required this.nextScreen});

  @override
  State<FitTechSplashScreen> createState() => _FitTechSplashScreenState();
}

class _FitTechSplashScreenState extends State<FitTechSplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _entryCtrl;
  late AnimationController _liftCtrl;
  late AnimationController _textCtrl;
  late AnimationController _glowCtrl;
  late AnimationController _transitionCtrl;

  late Animation<double> _logoScale;
  late Animation<double> _logoOpacity;
  late Animation<double> _liftAngle;
  late Animation<double> _barbellY;
  late Animation<double> _fitOffset;
  late Animation<double> _techOffset;
  late Animation<double> _textOpacity;
  late Animation<double> _swooshScale;
  late Animation<double> _glowRadius;

  // Transition: splash fades out, next screen slides up
  late Animation<double> _splashFadeOut;
  late Animation<double> _splashScaleUp;
  late Animation<double> _nextFadeIn;
  late Animation<Offset> _nextSlideIn;

  bool _showNext = false;

  @override
  void initState() {
    super.initState();

    // ── Logo entrance bounce ───────────────────────────────────────
    _entryCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 800));
    _logoScale = TweenSequence([
      TweenSequenceItem(
          tween: Tween(begin: 0.2, end: 1.12)
              .chain(CurveTween(curve: Curves.easeOut)),
          weight: 70),
      TweenSequenceItem(
          tween: Tween(begin: 1.12, end: 0.96)
              .chain(CurveTween(curve: Curves.easeIn)),
          weight: 15),
      TweenSequenceItem(
          tween: Tween(begin: 0.96, end: 1.0)
              .chain(CurveTween(curve: Curves.easeOut)),
          weight: 15),
    ]).animate(_entryCtrl);
    _logoOpacity = Tween(begin: 0.0, end: 1.0).animate(CurvedAnimation(
        parent: _entryCtrl,
        curve: const Interval(0.0, 0.4, curve: Curves.easeIn)));

    // ── Arm lift loop ──────────────────────────────────────────────
    _liftCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 1200));
    _liftAngle = Tween(begin: 0.0, end: 1.0)
        .animate(CurvedAnimation(parent: _liftCtrl, curve: Curves.easeInOut));
    _barbellY = Tween(begin: 0.0, end: -10.0)
        .animate(CurvedAnimation(parent: _liftCtrl, curve: Curves.easeInOut));

    // ── Text slide in ──────────────────────────────────────────────
    _textCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 600));
    _fitOffset = Tween(begin: -40.0, end: 0.0).animate(CurvedAnimation(
        parent: _textCtrl,
        curve: const Interval(0.0, 0.7, curve: Curves.easeOut)));
    _techOffset = Tween(begin: 40.0, end: 0.0).animate(CurvedAnimation(
        parent: _textCtrl,
        curve: const Interval(0.2, 0.9, curve: Curves.easeOut)));
    _textOpacity = Tween(begin: 0.0, end: 1.0).animate(CurvedAnimation(
        parent: _textCtrl,
        curve: const Interval(0.0, 0.5, curve: Curves.easeIn)));
    _swooshScale = Tween(begin: 0.0, end: 1.0).animate(CurvedAnimation(
        parent: _textCtrl,
        curve: const Interval(0.5, 1.0, curve: Curves.elasticOut)));

    // ── Gold glow pulse ────────────────────────────────────────────
    _glowCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 1800));
    _glowRadius = Tween(begin: 0.0, end: 18.0)
        .animate(CurvedAnimation(parent: _glowCtrl, curve: Curves.easeInOut));

    // ── Page transition ────────────────────────────────────────────
    // splash slightly zooms + fades out while next screen slides up
    _transitionCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 650));
    _splashFadeOut = Tween(begin: 1.0, end: 0.0).animate(CurvedAnimation(
        parent: _transitionCtrl,
        curve: const Interval(0.0, 0.55, curve: Curves.easeIn)));
    _splashScaleUp = Tween(begin: 1.0, end: 1.06).animate(CurvedAnimation(
        parent: _transitionCtrl,
        curve: const Interval(0.0, 0.55, curve: Curves.easeIn)));
    _nextFadeIn = Tween(begin: 0.0, end: 1.0).animate(CurvedAnimation(
        parent: _transitionCtrl,
        curve: const Interval(0.35, 1.0, curve: Curves.easeOut)));
    _nextSlideIn = Tween<Offset>(
      begin: const Offset(0.0, 0.05),
      end: Offset.zero,
    ).animate(CurvedAnimation(
        parent: _transitionCtrl,
        curve: const Interval(0.35, 1.0, curve: Curves.easeOut)));

    _runSequence();
  }

  Future<void> _runSequence() async {
    await _entryCtrl.forward();
    _textCtrl.forward();
    await Future.delayed(const Duration(milliseconds: 200));
    _liftCtrl.repeat(reverse: true);
    _glowCtrl.repeat(reverse: true);
    await Future.delayed(const Duration(milliseconds: 2000));
    _liftCtrl.stop();
    _glowCtrl.stop();
    // Mount next screen behind splash before animating
    setState(() => _showNext = true);
    await _transitionCtrl.forward();
  }

  @override
  void dispose() {
    _entryCtrl.dispose();
    _liftCtrl.dispose();
    _textCtrl.dispose();
    _glowCtrl.dispose();
    _transitionCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: Listenable.merge(
          [_entryCtrl, _liftCtrl, _textCtrl, _glowCtrl, _transitionCtrl]),
      builder: (context, _) {
        return Stack(
          children: [
            // ── Next screen underneath (fades + slides up) ─────────────
            if (_showNext)
              FadeTransition(
                opacity: _nextFadeIn,
                child: SlideTransition(
                  position: _nextSlideIn,
                  child: widget.nextScreen,
                ),
              ),

            // ── Splash on top (fades out + scales slightly) ────────────
            if (_splashFadeOut.value > 0.0)
              Opacity(
                opacity: _splashFadeOut.value,
                child: Transform.scale(
                  scale: _splashScaleUp.value,
                  child: _buildSplash(),
                ),
              ),
          ],
        );
      },
    );
  }

  Widget _buildSplash() {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F6F4), // warm off-white
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // ── Logo ────────────────────────────────────────────────
            Transform.scale(
              scale: _logoScale.value,
              child: Opacity(
                opacity: _logoOpacity.value,
                child: CustomPaint(
                  size: const Size(210, 210),
                  painter: FitTechLogoPainter(
                    liftProgress: _liftAngle.value,
                    barbellY: _barbellY.value,
                    glowRadius: _glowRadius.value,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 10),
            // ── FIT TECH text ────────────────────────────────────────
            Opacity(
              opacity: _textOpacity.value,
              child: SizedBox(
                height: 68,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    // Swoosh
                    Positioned(
                      bottom: 5,
                      child: Transform.scale(
                        scaleX: _swooshScale.value,
                        alignment: Alignment.centerLeft,
                        child: CustomPaint(
                          size: const Size(224, 13),
                          painter: SwooshPainter(),
                        ),
                      ),
                    ),
                    // FIT + TECH
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.baseline,
                      textBaseline: TextBaseline.alphabetic,
                      children: [
                        Transform.translate(
                          offset: Offset(_fitOffset.value, 0),
                          child: const Text(
                            'FIT',
                            style: TextStyle(
                              fontSize: 48,
                              fontWeight: FontWeight.w900,
                              // deep gold — clearly visible on light bg
                              color: Color(0xFFFFCC00),
                              letterSpacing: 3,
                              height: 1,
                            ),
                          ),
                        ),
                        Transform.translate(
                          offset: Offset(_techOffset.value, 0),
                          child: const Text(
                            'TECH',
                            style: TextStyle(
                              fontSize: 48,
                              fontWeight: FontWeight.w900,
                              // near-black — crisp on light bg
                              color: Color(0xFF1A1A1A),
                              letterSpacing: 3,
                              height: 1,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────
//  LOGO PAINTER
// ─────────────────────────────────────────────
class FitTechLogoPainter extends CustomPainter {
  final double liftProgress;
  final double barbellY;
  final double glowRadius;

  const FitTechLogoPainter({
    required this.liftProgress,
    required this.barbellY,
    required this.glowRadius,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2;
    final cy = size.height / 2;

    // Dark circle background — contrasts well against the light scaffold
    canvas.drawCircle(
        Offset(cx, cy), 95, Paint()..color = const Color(0xFF1A1A1A));

    // Gold glow
    if (glowRadius > 0) {
      canvas.drawCircle(
        Offset(cx, cy - 10),
        62,
        Paint()
          ..color =
          const Color(0xFFF5C433).withOpacity(0.14 + glowRadius / 110)
          ..maskFilter = MaskFilter.blur(BlurStyle.normal, glowRadius),
      );
    }

    final liftRad = liftProgress * 0.44;
    _drawBarbell(canvas, cx, cy - 32 + barbellY);
    _drawArms(canvas, cx, cy, liftRad);
    _drawTorso(canvas, cx, cy);
    _drawHead(canvas, cx, cy);
  }

  void _drawBarbell(Canvas canvas, double cx, double top) {
    // Bar
    canvas.drawRRect(
      RRect.fromRectAndRadius(
          Rect.fromCenter(center: Offset(cx, top), width: 104, height: 8),
          const Radius.circular(4)),
      Paint()..color = const Color(0xFFCCCCCC),
    );
    // Left plate
    canvas.drawRRect(
        RRect.fromRectAndRadius(
            Rect.fromLTWH(cx - 62, top - 14, 14, 22), const Radius.circular(3)),
        Paint()..color = const Color(0xFFF5C433));
    canvas.drawRRect(
        RRect.fromRectAndRadius(
            Rect.fromLTWH(cx - 58, top - 17, 6, 28), const Radius.circular(2)),
        Paint()..color = const Color(0xFFFFCC00));
    // Right plate
    canvas.drawRRect(
        RRect.fromRectAndRadius(
            Rect.fromLTWH(cx + 48, top - 14, 14, 22), const Radius.circular(3)),
        Paint()..color = const Color(0xFFFFCC00));
    canvas.drawRRect(
        RRect.fromRectAndRadius(
            Rect.fromLTWH(cx + 52, top - 17, 6, 28), const Radius.circular(2)),
        Paint()..color = const Color(0xFFFFCC00));
  }

  void _drawArms(Canvas canvas, double cx, double cy, double liftRad) {
    final armPaint = Paint()
      ..color = const Color(0xFFDDDDDD)
      ..strokeWidth = 13
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final ls = Offset(cx - 20, cy - 5);
    final rs = Offset(cx + 20, cy - 5);
    const len = 40.0;

    final lAngle = -pi / 2 - pi / 6 - liftRad * 0.3;
    final lh = Offset(ls.dx + cos(lAngle) * len, ls.dy + sin(lAngle) * len);
    canvas.drawLine(ls, lh, armPaint);

    final rAngle = -pi / 2 + pi / 6 + liftRad * 0.3;
    final rh = Offset(rs.dx + cos(rAngle) * len, rs.dy + sin(rAngle) * len);
    canvas.drawLine(rs, rh, armPaint);

    final fp = Paint()..color = const Color(0xFFFFCC00);
    canvas.drawCircle(lh, 7, fp);
    canvas.drawCircle(rh, 7, fp);
  }

  void _drawTorso(Canvas canvas, double cx, double cy) {
    final path = Path()
      ..moveTo(cx - 20, cy - 5)
      ..quadraticBezierTo(cx - 28, cy + 20, cx - 18, cy + 42)
      ..lineTo(cx + 18, cy + 42)
      ..quadraticBezierTo(cx + 28, cy + 20, cx + 20, cy - 5)
      ..close();
    canvas.drawPath(path, Paint()..color = const Color(0xFFE8E8E8));

    canvas.drawArc(
      Rect.fromCenter(center: Offset(cx, cy + 4), width: 36, height: 12),
      pi, pi, false,
      Paint()
        ..color = const Color(0xFFBBBBBB)
        ..strokeWidth = 1.5
        ..style = PaintingStyle.stroke,
    );
    for (int i = 0; i < 2; i++) {
      canvas.drawRRect(
          RRect.fromRectAndRadius(
              Rect.fromLTWH(cx - 10, cy + 14 + i * 10.0, 20, 7),
              const Radius.circular(2)),
          Paint()..color = const Color(0xFFCCCCCC));
    }
  }

  void _drawHead(Canvas canvas, double cx, double cy) {
    canvas.drawCircle(
        Offset(cx, cy - 28), 14, Paint()..color = const Color(0xFFFFCC00));
    canvas.drawArc(
      Rect.fromCenter(center: Offset(cx, cy - 31), width: 28, height: 17),
      pi, pi, false,
      Paint()..color = const Color(0xFF333333),
    );
  }

  @override
  bool shouldRepaint(FitTechLogoPainter old) =>
      old.liftProgress != liftProgress ||
          old.barbellY != barbellY ||
          old.glowRadius != glowRadius;
}

// ─────────────────────────────────────────────
//  SWOOSH PAINTER
// ─────────────────────────────────────────────
class SwooshPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawPath(
      Path()
        ..moveTo(0, size.height / 2)
        ..quadraticBezierTo(
            size.width / 2, size.height + 5, size.width, size.height / 2),
      Paint()
        ..color = const Color(0xFFFFCC00) // matches FIT text color
        ..strokeWidth = 3.5
        ..strokeCap = StrokeCap.round
        ..style = PaintingStyle.stroke,
    );
  }

  @override
  bool shouldRepaint(SwooshPainter _) => false;
}