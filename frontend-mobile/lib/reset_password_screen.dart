import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'api_service.dart';
import 'utils/toast_helper.dart';
import 'utils/validators.dart';

class ResetPasswordScreen extends StatefulWidget {
  final String token;
  const ResetPasswordScreen({super.key, this.token = ''});

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _isLoading = false;
  bool _newPasswordVisible = false;
  bool _confirmPasswordVisible = false;

  @override
  void dispose() {
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _onSaveChanges() async {
  // ──► Step 1: Check empty fields
  if (_newPasswordController.text.isEmpty ||
      _confirmPasswordController.text.isEmpty) {
    ToastHelper.showError(context, 'Please fill in all fields');
    return;
  }

  // ──► Step 2: Validate password length
  final passwordError = Validators.password(_newPasswordController.text.trim());
  if (passwordError != null) {
    ToastHelper.showError(context, passwordError);
    return;
  }

  // ──► Step 3: Check passwords match
  if (_newPasswordController.text != _confirmPasswordController.text) {
    ToastHelper.showError(context, 'Passwords do not match');
    return;
  }

  setState(() => _isLoading = true);

  final result = await ApiService().resetPassword(
    token: widget.token,
    newPassword: _newPasswordController.text.trim(),
  );

  if (!mounted) return;
  setState(() => _isLoading = false);

  if (result.success) {
    context.go('/reset-password/success');
  } else {
    final error = result.error ?? '';
    if (error.contains('expired')) {
      ToastHelper.showError(context, 'Reset link has expired. Please request a new one.');
    } else if (error.contains('invalid') || error.contains('Invalid')) {
      ToastHelper.showError(context, 'Invalid or already used reset link.');
    } else {
      ToastHelper.showError(context, 'Something went wrong. Try again later.');
    }
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
                      decoration: InputDecoration(
                        hintText: 'New password',
                        hintStyle: const TextStyle(color: Color(0xFFAAAAAA), fontSize: 14),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 22, vertical: 16),
                        suffixIcon: IconButton(
                          icon: Icon(
  _confirmPasswordVisible ? Icons.visibility_outlined : Icons.visibility_off_outlined,
  color: const Color(0xFFAAAAAA),
),
onPressed: () => setState(() => _confirmPasswordVisible = !_confirmPasswordVisible),
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
                      decoration: InputDecoration(
                        hintText: 'Confirmation of the new password',
                        hintStyle: const TextStyle(color: Color(0xFFAAAAAA), fontSize: 14),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 22, vertical: 16),
                        suffixIcon: IconButton(
                          icon: Icon(
  _newPasswordVisible ? Icons.visibility_outlined : Icons.visibility_off_outlined,
  color: const Color(0xFFAAAAAA),
),
onPressed: () => setState(() => _newPasswordVisible = !_newPasswordVisible),
                        ),
                      ),
                    ),
                  ),

                  const Spacer(flex: 2),

                  // Save changes button
                  SizedBox(
                    width: double.infinity,
                    height: 54,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _onSaveChanges,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFFCC00),
                        foregroundColor: Colors.black,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                      ),
                      child: _isLoading
                          ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.5,
                          color: Colors.black,
                        ),
                      )
                          : const Text(
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