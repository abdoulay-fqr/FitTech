import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'api_service.dart';
import 'utils/toast_helper.dart';
import 'utils/validators.dart';

class FreeTrialScreen extends StatefulWidget {
  const FreeTrialScreen({super.key});

  @override
  State<FreeTrialScreen> createState() => _FreeTrialScreenState();
}

class _FreeTrialScreenState extends State<FreeTrialScreen> {
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _fullNameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _onCheck() async {
    if (_fullNameController.text.trim().isEmpty ||
    _emailController.text.trim().isEmpty) {
  ToastHelper.showError(context, 'Please fill in all fields');
  return;
}
    final nameError = Validators.name(_fullNameController.text.trim(), 'Full name');
if (nameError != null) {
  ToastHelper.showError(context, nameError);
  return;
}

final emailError = Validators.email(_emailController.text.trim());
if (emailError != null) {
  ToastHelper.showError(context, emailError);
  return;
}

    setState(() => _isLoading = true);

    // ──► Step 1: Check if email exists in free trials table
    final checkResult = await ApiService().checkFreeTrial(
      email: _emailController.text.trim(),
    );

    if (!mounted) return;

    if (!checkResult.success) {
      setState(() => _isLoading = false);
      ToastHelper.showError(context, checkResult.error ?? 'Something went wrong');
      return;
    }

    final exists = checkResult.data['exists'] as bool;

    // ──► Case 2: Email exists + used = false
    if (exists && checkResult.data['used'] == false) {
      setState(() => _isLoading = false);
      ToastHelper.showError(context, 'You already have a free trial pending. Go to the gym to use it!');
      return;
    }

    // ──► Case 3: Email exists + used = true
    if (exists && checkResult.data['used'] == true) {
      setState(() => _isLoading = false);
      ToastHelper.showError(context, 'You have already used your free trial session.');
      return;
    }

    // ──► Case 1: Email not in table → create the trial
    final createResult = await ApiService().freeTrial(
      fullName: _fullNameController.text.trim(),
      email: _emailController.text.trim(),
    );

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (createResult.success) {
      final trialId = createResult.data['data']['id'] ?? '';
      context.go('/free-trial/success', extra: trialId);
    } else {
      ToastHelper.showError(context, createResult.error ?? 'Something went wrong');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      resizeToAvoidBottomInset: true,
      body: Stack(
        children: [
          // ── Background top ─────────────────────────────────────────────
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: Image.asset(
              'assets/images/tr_success_bg.png',
              fit: BoxFit.fitWidth,
              errorBuilder: (_, __, ___) => const SizedBox.shrink(),
            ),
          ),

          // ── Small yellow half circle right side ────────────────────────
          Positioned(
            top: 220,
            right: -20,
            child: Container(
              width: 60,
              height: 110,
              decoration: const BoxDecoration(
                color: Color(0xFFFFCC00),
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(80),
                  bottomLeft: Radius.circular(80),
                ),
              ),
            ),
          ),

          // ── Main content ───────────────────────────────────────────────
          GestureDetector(
            onTap: () => FocusScope.of(context).unfocus(),
            child: SafeArea(
              child: SingleChildScrollView(
                physics: const ClampingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 28),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 220),

                    // ── Back button ──────────────────────────────────
                    GestureDetector(
                      onTap: () => Navigator.pop(context),
                      child: const Icon(
                        Icons.arrow_back_ios,
                        color: Color(0xFF1A1A1A),
                        size: 22,
                      ),
                    ),

                    const SizedBox(height: 16),

                    // ── Title ────────────────────────────────────────
                    const Text(
                      'Get',
                      style: TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF1A1A1A),
                        height: 1.1,
                      ),
                    ),
                    const Text(
                      'Your free trial',
                      style: TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF1A1A1A),
                        height: 1.1,
                      ),
                    ),

                    const SizedBox(height: 32),

                    // ── Full name field ──────────────────────────────
                    Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFFF2F2F2),
                        borderRadius: BorderRadius.circular(30),
                      ),
                      child: TextField(
                        controller: _fullNameController,
                        decoration: const InputDecoration(
                          hintText: 'Full name',
                          hintStyle: TextStyle(
                            color: Color(0xFFAAAAAA),
                            fontSize: 14,
                          ),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(
                              horizontal: 22, vertical: 16),
                        ),
                      ),
                    ),

                    const SizedBox(height: 14),

                    // ── Email field ──────────────────────────────────
                    Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFFF2F2F2),
                        borderRadius: BorderRadius.circular(30),
                      ),
                      child: TextField(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        decoration: const InputDecoration(
                          hintText: 'Email address',
                          hintStyle: TextStyle(
                            color: Color(0xFFAAAAAA),
                            fontSize: 14,
                          ),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(
                              horizontal: 22, vertical: 16),
                        ),
                      ),
                    ),

                    const SizedBox(height: 80),

                    // ── Check button ─────────────────────────────────
                    SizedBox(
                      width: double.infinity,
                      height: 54,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _onCheck,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFFFCC00),
                          foregroundColor: Colors.black,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                        ),
                        child: _isLoading
                            ? const CircularProgressIndicator(color: Colors.black)
                            : const Text(
                                'Check',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 0.3,
                                ),
                              ),
                      ),
                    ),

                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}