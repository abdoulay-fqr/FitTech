import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:app_links/app_links.dart';

import 'splash_screen.dart';
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
import 'profile_screen.dart';
import 'edit_profile_screen.dart';
import 'transitions.dart';

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

    try {
      final initialLink = await _appLinks.getInitialLink();
      if (initialLink != null) _handleDeepLink(initialLink);
    } catch (e) {
      debugPrint('❌ Error getting initial link: $e');
    }

    _linkSubscription = _appLinks.uriLinkStream.listen(
          (Uri? uri) {
        if (uri != null) _handleDeepLink(uri);
      },
      onError: (err) => debugPrint('❌ Error listening to link stream: $err'),
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 🎯 PARSE AND NAVIGATE
  // ══════════════════════════════════════════════════════════════════
  void _handleDeepLink(Uri uri) {
    debugPrint('🔗 Deep link received: $uri');

    if (uri.scheme == 'fittech') {
      String? token = uri.queryParameters['token'];

      if (token == null && uri.query.isNotEmpty) {
        final parts = uri.query.split('=');
        if (parts.length == 2 && parts[0] == 'token') token = parts[1];
      }

      if (uri.host == 'reset-password' || uri.path.contains('reset-password')) {
        if (token != null && token.isNotEmpty) {
          Future.delayed(const Duration(milliseconds: 200), () {
            _router.go('/reset-password?token=$token');
          });
        }
      }
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // 🛣️ ROUTER CONFIGURATION
  // ══════════════════════════════════════════════════════════════════
  GoRouter _createRouter() {
    return GoRouter(
      // Always start with splash
      initialLocation: '/splash',
      routes: [

        // ── Splash ─────────────────────────────────────────────────────
        // We pass the next screen as a widget directly so the splash can
        // do a visual cross-fade/slide transition without a Navigator push.
        // After the transition the splash calls context.go() to hand off
        // routing control to GoRouter.
        GoRoute(
          path: '/splash',
          builder: (context, state) => FitTechSplashScreen(
            // The widget rendered "underneath" during the cross-fade
            nextScreen: widget.seenOnboarding
                ? const SignInScreen()
                : const OnboardingScreen(),
          ),
        ),

        // ── Onboarding & Carousel ───────────────────────────────────────
        GoRoute(
          path: '/onboarding',
          builder: (context, state) => const OnboardingScreen(),
        ),
        GoRoute(
          path: '/carousel',
          builder: (context, state) => const CarouselScreen(),
        ),

        // ── Auth ────────────────────────────────────────────────────────
        GoRoute(
          path: '/signin',
          builder: (context, state) => const SignInScreen(),
        ),
        GoRoute(
          path: '/signup',
          builder: (context, state) => const SignUpScreen(),
        ),

        // ── Forgot Password ─────────────────────────────────────────────
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
          path: '/reset-password',
          builder: (context, state) {
            final token = state.uri.queryParameters['token'] ?? '';
            return ResetPasswordScreen(token: token);
          },
        ),
        GoRoute(
          path: '/reset-password/success',
          builder: (context, state) => const PasswordResetSuccessScreen(),
        ),

        // ── Free Trial ──────────────────────────────────────────────────
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

        // ── Home — fade transition ──────────────────────────────────────
        GoRoute(
          path: '/home',
          pageBuilder: (context, state) => FadeTransitionPage(
            key: state.pageKey,
            child: const HomeScreen(),
          ),
        ),

        // ── Profile — fade transition ───────────────────────────────────
        GoRoute(
          path: '/profile',
          pageBuilder: (context, state) => FadeTransitionPage(
            key: state.pageKey,
            child: const ProfileScreen(),
          ),
        ),

        // ── Edit Profile — slide up ─────────────────────────────────────
        GoRoute(
          path: '/edit-profile',
          pageBuilder: (context, state) {
            final extra = state.extra as Map<String, dynamic>?;
            return SlideUpTransitionPage(
              key: state.pageKey,
              child: EditProfileScreen(
                member: extra?['member'],
                memberId: extra?['memberId'],
              ),
            );
          },
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
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFFFFCC00)),
        useMaterial3: true,
      ),
    );
  }
}