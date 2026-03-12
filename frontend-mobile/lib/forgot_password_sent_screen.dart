import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ForgotPasswordSentScreen extends StatelessWidget {
  final String email;
  const ForgotPasswordSentScreen({super.key, required this.email});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // ── splash_bg.png flipped top-right ───────────────────────────
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: Transform(
              alignment: Alignment.center,
              transform: Matrix4.rotationY(3.14159),
              child: Image.asset(
                'assets/images/tr_success_bg.png',
                fit: BoxFit.fitWidth,
                errorBuilder: (_, __, ___) => const SizedBox.shrink(),
              ),
            ),
          ),

          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 36),
              child: Column(
                children: [
                  const Spacer(flex: 2),

                  // ✉️ Email sent icon
                  const Icon(
                    Icons.mark_email_unread_rounded,
                    size: 72,
                    color: Color(0xFFFFCC00),
                  ),

                  const SizedBox(height: 24),

                  // Title
                  const Text(
                    'The link has been sent!',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF1A1A1A),
                    ),
                  ),

                  const SizedBox(height: 14),

                  // Description with dynamic email
                  Text(
                    'You will receive a link to reset your password at the following address: $email',
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 14,
                      color: Color(0xFF666666),
                      height: 1.6,
                    ),
                  ),

                  const Spacer(flex: 2),

                  // Check your inbox button
                  SizedBox(
                    width: double.infinity,
                    height: 54,
                    child: ElevatedButton(
                      onPressed: () {
                        context.push('/reset-password');
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFFCC00),
                        foregroundColor: Colors.black,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                      ),
                      child: const Text(
                        'Check your inbox',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
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