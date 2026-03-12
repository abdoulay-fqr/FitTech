import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'api_service.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final _firstNameController = TextEditingController();
  final _secondNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _isPasswordVisible = false;
  bool _acceptedTerms = false;
  bool _isLoading = false;
  String? _errorMessage;
  String _selectedCivility = 'Man';

  @override
  void dispose() {
    _firstNameController.dispose();
    _secondNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _onRegister() async {
    setState(() => _errorMessage = null);

    if (_firstNameController.text.trim().isEmpty ||
        _secondNameController.text.trim().isEmpty ||
        _emailController.text.trim().isEmpty ||
        _passwordController.text.trim().isEmpty) {
      setState(() => _errorMessage = 'Please fill in all fields');
      return;
    }

    if (!_acceptedTerms) {
      setState(() => _errorMessage = 'Please accept the terms and conditions');
      return;
    }

    setState(() => _isLoading = true);

    final result = await ApiService().register(
      email: _emailController.text.trim(),
      password: _passwordController.text.trim(),
      firstName: _firstNameController.text.trim(),
      secondName: _secondNameController.text.trim(),
      gender: _selectedCivility == 'Man' ? 'MALE' : 'FEMALE',
    );

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (result.success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Account created successfully!'),
          backgroundColor: Colors.green,
        ),
      );
      context.go('/signin');
    } else {
      setState(() => _errorMessage = result.error);
    }
  }

  void _onSignIn() {
    context.go('/signin');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // ── Light yellow blob top-left ─────────────────────────────
          Positioned(
            top: 0,
            left: 0,
            child: Image.asset(
              'assets/images/signup_bg.png',
              width: 220,
              errorBuilder: (_, __, ___) => Container(
                width: 220,
                height: 200,
                decoration: const BoxDecoration(
                  color: Color(0xFFFFF8D6),
                  borderRadius: BorderRadius.only(
                    bottomRight: Radius.circular(160),
                    bottomLeft: Radius.circular(80),
                  ),
                ),
              ),
            ),
          ),

          // ── Yellow half circle right side ──────────────────────────
          Positioned(
            top: 160,
            right: -30,
            child: Container(
              width: 70,
              height: 130,
              decoration: const BoxDecoration(
                color: Color(0xFFFFCC00),
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(80),
                  bottomLeft: Radius.circular(80),
                ),
              ),
            ),
          ),

          // ── Main scrollable content ────────────────────────────────
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 28),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 50),

                  // Title
                  const Text(
                    'Create',
                    style: TextStyle(
                      fontSize: 36,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF1A1A1A),
                      height: 1.1,
                    ),
                  ),
                  const Text(
                    'Your account',
                    style: TextStyle(
                      fontSize: 36,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF1A1A1A),
                      height: 1.1,
                    ),
                  ),

                  const SizedBox(height: 32),

                  // ── Civility selector ────────────────────────────
                  Row(
                    children: [
                      const Text(
                        'Civility : ',
                        style: TextStyle(
                          fontSize: 15,
                          color: Color(0xFF1A1A1A),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(width: 8),
                      _CivilityButton(
                        label: 'Man',
                        icon: '🧍',
                        isSelected: _selectedCivility == 'Man',
                        onTap: () => setState(() => _selectedCivility = 'Man'),
                      ),
                      const SizedBox(width: 10),
                      _CivilityButton(
                        label: 'Woman',
                        icon: '🧍‍♀️',
                        isSelected: _selectedCivility == 'Woman',
                        onTap: () =>
                            setState(() => _selectedCivility = 'Woman'),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // ── Input fields ─────────────────────────────────
                  _InputField(
                    controller: _firstNameController,
                    hint: 'First name',
                  ),
                  const SizedBox(height: 14),
                  _InputField(
                    controller: _secondNameController,
                    hint: 'Second name',
                  ),
                  const SizedBox(height: 14),
                  _InputField(
                    controller: _emailController,
                    hint: 'Email address',
                    keyboardType: TextInputType.emailAddress,
                  ),
                  const SizedBox(height: 14),

                  // Password field
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFF2F2F2),
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: TextField(
                      controller: _passwordController,
                      obscureText: !_isPasswordVisible,
                      decoration: InputDecoration(
                        hintText: 'Password',
                        hintStyle: const TextStyle(
                          color: Color(0xFFAAAAAA),
                          fontSize: 14,
                        ),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(
                            horizontal: 22, vertical: 16),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _isPasswordVisible
                                ? Icons.visibility_off_outlined
                                : Icons.visibility_off_outlined,
                            color: const Color(0xFFAAAAAA),
                          ),
                          onPressed: () => setState(
                                  () => _isPasswordVisible = !_isPasswordVisible),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // ── Terms and conditions ─────────────────────────
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      GestureDetector(
                        onTap: () =>
                            setState(() => _acceptedTerms = !_acceptedTerms),
                        child: Container(
                          width: 20,
                          height: 20,
                          decoration: BoxDecoration(
                            color: _acceptedTerms
                                ? const Color(0xFFFFCC00)
                                : Colors.transparent,
                            border: Border.all(
                              color: _acceptedTerms
                                  ? const Color(0xFFFFCC00)
                                  : const Color(0xFFAAAAAA),
                              width: 1.5,
                            ),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: _acceptedTerms
                              ? const Icon(Icons.check,
                              size: 14, color: Colors.black)
                              : null,
                        ),
                      ),
                      const SizedBox(width: 10),
                      const Expanded(
                        child: Text(
                          'I accept the terms and conditions and the privacy policy',
                          style: TextStyle(
                            fontSize: 12,
                            color: Color(0xFF666666),
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // ── Already have account ─────────────────────────
                  Center(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          'Do you already have an account? ',
                          style: TextStyle(
                            fontSize: 13,
                            color: Color(0xFF666666),
                          ),
                        ),
                        GestureDetector(
                          onTap: _onSignIn,
                          child: const Text(
                            'Sign in!',
                            style: TextStyle(
                              fontSize: 13,
                              color: Color(0xFFFFCC00),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // ── Error message ────────────────────────────────
                  if (_errorMessage != null) ...[
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: Colors.red.shade50,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.red.shade200),
                      ),
                      child: Text(
                        _errorMessage!,
                        style: TextStyle(
                          color: Colors.red.shade700,
                          fontSize: 13,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // ── Register button ──────────────────────────────
                  SizedBox(
                    width: double.infinity,
                    height: 54,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _onRegister,
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
                        'Register',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.3,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // ── Get a free trial ─────────────────────────────
                  Center(
                    child: TextButton(
                      onPressed: () => context.push('/free-trial'),
                      child: const Text(
                        'GET A FREE TRIAL',
                        style: TextStyle(
                          fontSize: 13,
                          color: Color(0xFFFFCC00),
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1.2,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Civility Button ───────────────────────────────────────────────────────────
class _CivilityButton extends StatelessWidget {
  final String label;
  final String icon;
  final bool isSelected;
  final VoidCallback onTap;

  const _CivilityButton({
    required this.label,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding:
        const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? const Color(0xFFFFCC00)
              : Colors.white,
          borderRadius: BorderRadius.circular(30),
          border: Border.all(
            color: isSelected
                ? const Color(0xFFFFCC00)
                : const Color(0xFFDDDDDD),
            width: 1.5,
          ),
        ),
        child: Row(
          children: [
            Text(icon, style: const TextStyle(fontSize: 16)),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: isSelected ? Colors.black : const Color(0xFF666666),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Reusable Input Field ──────────────────────────────────────────────────────
class _InputField extends StatelessWidget {
  final TextEditingController controller;
  final String hint;
  final TextInputType keyboardType;

  const _InputField({
    required this.controller,
    required this.hint,
    this.keyboardType = TextInputType.text,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFF2F2F2),
        borderRadius: BorderRadius.circular(30),
      ),
      child: TextField(
        controller: controller,
        keyboardType: keyboardType,
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: const TextStyle(
            color: Color(0xFFAAAAAA),
            fontSize: 14,
          ),
          border: InputBorder.none,
          contentPadding:
          const EdgeInsets.symmetric(horizontal: 22, vertical: 16),
        ),
      ),
    );
  }
}