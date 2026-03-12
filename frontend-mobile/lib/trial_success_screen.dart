import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class TrialSuccessScreen extends StatelessWidget {
  const TrialSuccessScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // ── splash_bg.png top-right (flipped) ─────────────────────────
          Positioned(
            top: 0,
            right: 0,
            child: Transform(
              alignment: Alignment.center,
              transform: Matrix4.rotationY(3.14159), // flip horizontally
              child: Image.asset(
                'assets/images/tr_success_bg.png',
                width: MediaQuery.of(context).size.width,
                fit: BoxFit.fitWidth,
                errorBuilder: (_, __, ___) => const SizedBox.shrink(),
              ),
            ),
          ),

          // ── Main content centered ──────────────────────────────────────
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 36),
              child: Column(
                children: [
                  const Spacer(flex: 2),

                  // 🎉 Party popper icon
                  const Icon(
                    Icons.celebration_rounded,
                    size: 72,
                    color: Color(0xFFFFCC00),
                  ),

                  const SizedBox(height: 24),

                  // Congratulations title
                  const Text(
                    'Congratulations',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF1A1A1A),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Description
                  const Text(
                    'You have won a free trial session under ID 457457. Show this number to the receptionist along with your ID card.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 14,
                      color: Color(0xFF666666),
                      height: 1.6,
                    ),
                  ),

                  const Spacer(flex: 3),

                  // Sign in button
                  SizedBox(
                    width: double.infinity,
                    height: 54,
                    child: ElevatedButton(
                      onPressed: () => context.go('/signin'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFFCC00),
                        foregroundColor: Colors.black,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                      ),
                      child: const Text(
                        'Sign in',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.3,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}