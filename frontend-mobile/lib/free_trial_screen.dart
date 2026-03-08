import 'package:flutter/material.dart';
import 'trial_success_screen.dart';

class FreeTrialScreen extends StatefulWidget {
  const FreeTrialScreen({super.key});

  @override
  State<FreeTrialScreen> createState() => _FreeTrialScreenState();
}

class _FreeTrialScreenState extends State<FreeTrialScreen> {
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  bool _showError = false;

  @override
  void dispose() {
    _fullNameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  void _onCheck() {
    if (_fullNameController.text.isEmpty || _emailController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill in all fields')),
      );
      return;
    }
    // TODO: replace with real API check
    // If credentials already used → show error:
    // setState(() => _showError = true);

    // If all good → go to success screen
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const TrialSuccessScreen()),
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
            child: Image.asset(
              'assets/images/splash_bg.png',
              fit: BoxFit.fitWidth,
              errorBuilder: (_, __, ___) => const SizedBox.shrink(),
            ),
          ),

          // El mainn
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 28),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 220),
                  const SizedBox(height: 25),
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

                  // Full name field
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFF2F2F2),
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: TextField(
                      controller: _fullNameController,
                      onChanged: (_) => setState(() => _showError = false),
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
                  // Email field
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFF2F2F2),
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: TextField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      onChanged: (_) => setState(() => _showError = false),
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

                  const SizedBox(height: 12),
                  // Error message
                  if (_showError)
                    const Padding(
                      padding: EdgeInsets.only(left: 8),
                      child: Text(
                        'The person with these credentials has already taken his free trial!',
                        style: TextStyle(
                          color: Colors.red,
                          fontSize: 13,
                          height: 1.5,
                        ),
                      ),
                    ),

                  const SizedBox(height: 80),
                  //check button
                  SizedBox(
                    width: double.infinity,
                    height: 54,
                    child: ElevatedButton(
                      onPressed: _onCheck,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFFCC00),
                        foregroundColor: Colors.black,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                      ),
                      child: const Text(
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
        ],
      ),
    );
  }
}