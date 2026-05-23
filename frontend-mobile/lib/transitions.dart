import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

// ── Custom page transitions ────────────────────────────────────────
// Use these instead of default GoRouter builder

class FadeTransitionPage extends CustomTransitionPage {
  FadeTransitionPage({
    required super.child,
    super.key,
    super.name,
  }) : super(
    transitionDuration: const Duration(milliseconds: 220),
    reverseTransitionDuration: const Duration(milliseconds: 180),
    transitionsBuilder: (_, animation, __, child) => FadeTransition(
      opacity: CurvedAnimation(
        parent: animation,
        curve: Curves.easeIn,
      ),
      child: child,
    ),
  );
}

class SlideUpTransitionPage extends CustomTransitionPage {
  SlideUpTransitionPage({
    required super.child,
    super.key,
    super.name,
  }) : super(
    transitionDuration: const Duration(milliseconds: 300),
    reverseTransitionDuration: const Duration(milliseconds: 250),
    transitionsBuilder: (_, animation, __, child) {
      final slide = Tween<Offset>(
        begin: const Offset(0, 0.08),
        end: Offset.zero,
      ).animate(CurvedAnimation(
        parent: animation,
        curve: Curves.easeOutCubic,
      ));
      final fade = CurvedAnimation(
        parent: animation,
        curve: Curves.easeIn,
      );
      return FadeTransition(
        opacity: fade,
        child: SlideTransition(position: slide, child: child),
      );
    },
  );
}

class SlideRightTransitionPage extends CustomTransitionPage {
  SlideRightTransitionPage({
    required super.child,
    super.key,
    super.name,
  }) : super(
    transitionDuration: const Duration(milliseconds: 280),
    reverseTransitionDuration: const Duration(milliseconds: 240),
    transitionsBuilder: (_, animation, __, child) {
      final slide = Tween<Offset>(
        begin: const Offset(1.0, 0),
        end: Offset.zero,
      ).animate(CurvedAnimation(
        parent: animation,
        curve: Curves.easeOutCubic,
      ));
      return SlideTransition(position: slide, child: child);
    },
  );
}