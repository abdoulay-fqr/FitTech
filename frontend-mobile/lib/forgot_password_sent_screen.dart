import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class ForgotPasswordSentScreen extends StatelessWidget {
  final String email;
  const ForgotPasswordSentScreen({super.key, required this.email});

  Future<void> _openGmail() async {
    final Uri gmailUri = Uri.parse('googlegmail://');
    final Uri gmailPlayStore = Uri.parse(
        'https://play.google.com/store/apps/details?id=com.google.android.gm');

    if (await canLaunchUrl(gmailUri)) {
      await launchUrl(gmailUri);
    } else {
      await launchUrl(gmailPlayStore, mode: LaunchMode.externalApplication);
    }
  }

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
                    'Check your inbox!',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF1A1A1A),
                    ),
                  ),

                  const SizedBox(height: 14),

                  // Description
                  Text(
                    'If an account with $email exists, you will receive a password reset link shortly.',
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
                      onPressed: _openGmail,
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
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.w800),
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Back to sign in
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: const Text(
                      'Back',
                      style: TextStyle(
                        fontSize: 14,
                        color: Color(0xFF888888),
                        fontWeight: FontWeight.w500,
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