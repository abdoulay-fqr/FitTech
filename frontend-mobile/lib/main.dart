import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:app_links/app_links.dart';

import 'onboarding_screen.dart';
import 'carousel_screen.dart';
import 'signin_screen.dart';
import 'signup_screen.dart';
import 'forgot_password_screen.dart';
import 'forgot_password_sent_screen.dart';
import 'reset_password_screen.dart';
import 'password_reset_success_screen.dart';
import 'free_trial_screen.dart';
import 'trial_success_screen.dart';
import 'home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final prefs = await SharedPreferences.getInstance();

  // 👇 UNCOMMENT this line to show onboarding (e.g. when showing teacher)
  await prefs.clear();

  final bool seenOnboarding = prefs.getBool('seen_onboarding') ?? false;

  runApp(MyApp(seenOnboarding: seenOnboarding));
}

class MyApp extends StatefulWidget {
  final bool seenOnboarding;
  const MyApp({super.key, required this.seenOnboarding});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  late final GoRouter _router;
  late AppLinks _appLinks;
  StreamSubscription? _linkSubscription;

  @override
  void initState() {
    super.initState();
    _router = _createRouter();
    _initDeepLinks();
  }

  @override
  void dispose() {
    _linkSubscription?.cancel();
    super.dispose();
  }

  // ══════════════════════════════════════════════════════════════════
  // 🔗 DEEP LINK HANDLER
  // ══════════════════════════════════════════════════════════════════
  void _initDeepLinks() async {
    _appLinks = AppLinks();

    // Handle initial link (app was closed and opened via link)
    try {
      final initialLink = await _appLinks.getInitialLink();
      if (initialLink != null) {
        _handleDeepLink(initialLink);
      }
    } catch (e) {
      debugPrint('❌ Error getting initial link: $e');
    }

    // Handle links while app is running
    _linkSubscription = _appLinks.uriLinkStream.listen(
          (Uri? uri) {
        if (uri != null) {
          _handleDeepLink(uri);
        }
      },
      onError: (err) {
        debugPrint('❌ Error listening to link stream: $err');
      },
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 🎯 PARSE AND NAVIGATE
  // ══════════════════════════════════════════════════════════════════
  void _handleDeepLink(Uri uri) {
    final link = uri.toString();
    debugPrint('🔗 Deep link received (original): $link');
    debugPrint('🔍 Scheme: ${uri.scheme}');
    debugPrint('🔍 Host: ${uri.host}');
    debugPrint('🔍 Path: ${uri.path}');
    debugPrint('🔍 Query: ${uri.query}');
    debugPrint('🔍 Query Parameters: ${uri.queryParameters}');

    // fittech://reset-password?token=xxx
    if (uri.scheme == 'fittech') {
      // Get token from query parameters
      String? token = uri.queryParameters['token'];

      debugPrint('🔍 Token from queryParameters: $token');

      // If token is null, try parsing the query string manually
      if (token == null && uri.query.isNotEmpty) {
        final queryParts = uri.query.split('=');
        if (queryParts.length == 2 && queryParts[0] == 'token') {
          token = queryParts[1];
          debugPrint('🔍 Token from manual parse: $token');
        }
      }

      // Check if it's a reset-password link
      if (uri.host == 'reset-password' || uri.path.contains('reset-password')) {
        if (token != null && token.isNotEmpty) {
          debugPrint('✅ Navigating to reset password with token: $token');

          // Navigate after a small delay to ensure router is ready
          Future.delayed(const Duration(milliseconds: 200), () {
            _router.go('/reset-password?token=$token');
          });
        } else {
          debugPrint('⚠️ No token found in reset password link');
        }
      } else {
        debugPrint('⚠️ Not a reset-password link. Host: ${uri.host}, Path: ${uri.path}');
      }
    } else {
      debugPrint('⚠️ Not a fittech:// scheme. Got: ${uri.scheme}');
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // 🛣️ ROUTER CONFIGURATION
  // ══════════════════════════════════════════════════════════════════
  GoRouter _createRouter() {
    return GoRouter(
      initialLocation: widget.seenOnboarding ? '/signin' : '/onboarding',
      routes: [
        // ── Home ──────────────────────────────────────────────────────
        GoRoute(
          path: '/home',
          builder: (context, state) => const HomeScreen(),
        ),

        // ── Onboarding & Carousel ──────────────────────────────────────
        GoRoute(
          path: '/onboarding',
          builder: (context, state) => const OnboardingScreen(),
        ),
        GoRoute(
          path: '/carousel',
          builder: (context, state) => const CarouselScreen(),
        ),

        // ── Auth ───────────────────────────────────────────────────────
        GoRoute(
          path: '/signin',
          builder: (context, state) => const SignInScreen(),
        ),
        GoRoute(
          path: '/signup',
          builder: (context, state) => const SignUpScreen(),
        ),

        // ── Forgot Password flow ───────────────────────────────────────
        GoRoute(
          path: '/forgot-password',
          builder: (context, state) => const ForgotPasswordScreen(),
        ),
        GoRoute(
          path: '/forgot-password/sent',
          builder: (context, state) {
            final email = state.extra as String? ?? '';
            return ForgotPasswordSentScreen(email: email);
          },
        ),
        GoRoute(
          path: '/reset-password', // ← deep link ready 🔗
          builder: (context, state) {
            final token = state.uri.queryParameters['token'] ?? '';
            return ResetPasswordScreen(token: token);
          },
        ),
        GoRoute(
          path: '/reset-password/success',
          builder: (context, state) => const PasswordResetSuccessScreen(),
        ),

        // ── Free Trial flow ────────────────────────────────────────────
        GoRoute(
          path: '/free-trial',
          builder: (context, state) => const FreeTrialScreen(),
        ),
        GoRoute(
          path: '/free-trial/success',
          builder: (context, state) => TrialSuccessScreen(
  trialId: state.extra as String? ?? 'N/A',
),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Fit-Tech',
      debugShowCheckedModeBanner: false,
      routerConfig: _router,
      builder: (context, child) => child!,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFFFFCC00)),
        useMaterial3: true,
      ),
    );
  }
}