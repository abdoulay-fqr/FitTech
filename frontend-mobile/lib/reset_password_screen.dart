import 'package:flutter/material.dart';
import 'password_reset_success_screen.dart';

class ResetPasswordScreen extends StatefulWidget {
  const ResetPasswordScreen({super.key});

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _showError = false;
  bool _newPasswordVisible = false;
  bool _confirmPasswordVisible = false;

  @override
  void dispose() {
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _onSaveChanges() {
    if (_newPasswordController.text != _confirmPasswordController.text) {
      setState(() => _showError = true);
      return;
    }
    if (_newPasswordController.text.isEmpty) {
      setState(() => _showError = true);
      return;
    }
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const PasswordResetSuccessScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
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
              padding: const EdgeInsets.symmetric(horizontal: 28),
              child: Column(
                children: [
                  const Spacer(flex: 2),

                  // 🔒 Lock icon
                  Container(
                    width: 72,
                    height: 72,
                    decoration: const BoxDecoration(
                      color: Color(0xFFFFCC00),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.lock_reset_rounded,
                      color: Colors.white,
                      size: 36,
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Title
                  const Text(
                    'Reset your password',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF1A1A1A),
                    ),
                  ),

                  const SizedBox(height: 32),

                  // New password field
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFF2F2F2),
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: TextField(
                      controller: _newPasswordController,
                      obscureText: !_newPasswordVisible,
                      onChanged: (_) => setState(() => _showError = false),
                      decoration: InputDecoration(
                        hintText: 'New password',
                        hintStyle: const TextStyle(color: Color(0xFFAAAAAA), fontSize: 14),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 22, vertical: 16),
                        suffixIcon: IconButton(
                          icon: Icon(Icons.visibility_off_outlined, color: const Color(0xFFAAAAAA)),
                          onPressed: () => setState(() => _newPasswordVisible = !_newPasswordVisible),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 14),

                  // Confirm password field
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFF2F2F2),
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: TextField(
                      controller: _confirmPasswordController,
                      obscureText: !_confirmPasswordVisible,
                      onChanged: (_) => setState(() => _showError = false),
                      decoration: InputDecoration(
                        hintText: 'Confirmation of the new password',
                        hintStyle: const TextStyle(color: Color(0xFFAAAAAA), fontSize: 14),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 22, vertical: 16),
                        suffixIcon: IconButton(
                          icon: Icon(Icons.visibility_off_outlined, color: const Color(0xFFAAAAAA)),
                          onPressed: () => setState(() => _confirmPasswordVisible = !_confirmPasswordVisible),
                        ),
                      ),
                    ),
                  ),

                  // Error
                  if (_showError)
                    const Padding(
                      padding: EdgeInsets.only(top: 10, left: 8),
                      child: Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          "The password you entered doesn't match the first one",
                          style: TextStyle(color: Colors.red, fontSize: 13),
                        ),
                      ),
                    ),

                  const Spacer(flex: 2),

                  // Save changes button
                  SizedBox(
                    width: double.infinity,
                    height: 54,
                    child: ElevatedButton(
                      onPressed: _onSaveChanges,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFFCC00),
                        foregroundColor: Colors.black,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                      ),
                      child: const Text(
                        'Save changes',
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