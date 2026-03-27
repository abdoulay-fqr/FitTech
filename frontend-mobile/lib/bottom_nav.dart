import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';

class BottomNav extends StatefulWidget {
  final int currentIndex;
  const BottomNav({super.key, required this.currentIndex});

  @override
  State<BottomNav> createState() => _BottomNavState();
}

class _BottomNavState extends State<BottomNav> with TickerProviderStateMixin {
  // Tap scale controller — fires once on tap only
  late AnimationController _scaleController;
  late Animation<double> _scaleAnim;
  int _tappedIndex = -1;

  // Bell shake controller — fires once on bell tap only
  late AnimationController _bellController;
  late Animation<double> _bellAnim;

  @override
  void initState() {
    super.initState();

    _scaleController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    _scaleAnim = Tween<double>(begin: 1.0, end: 1.25).animate(
      CurvedAnimation(parent: _scaleController, curve: Curves.elasticOut),
    );
    _scaleController.addStatusListener((s) {
      if (s == AnimationStatus.completed) _scaleController.reverse();
    });

    _bellController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );
    _bellAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _bellController, curve: Curves.elasticInOut),
    );
    _bellController.addStatusListener((s) {
      if (s == AnimationStatus.completed) _bellController.reset();
    });
  }

  @override
  void dispose() {
    _scaleController.dispose();
    _bellController.dispose();
    super.dispose();
  }

  void _onTap(int index) {
    HapticFeedback.lightImpact();
    setState(() => _tappedIndex = index);
    _scaleController.forward(from: 0.0);

    if (index == 2) {
      // Bell — shake + haptic
      _bellController.forward(from: 0.0);
      HapticFeedback.mediumImpact();
      _showComingSoon();
      return;
    }
    if (index == 1) {
      _showComingSoon();
      return;
    }

    final routes = ['/home', '/home', '/home', '/profile'];
    if (index != widget.currentIndex) {
      context.go(routes[index]);
    }
  }

  void _showComingSoon() {
    final overlay = Overlay.of(context);
    late OverlayEntry entry;
    entry = OverlayEntry(
      builder: (_) => Positioned(
        bottom: 85,
        left: 60,
        right: 60,
        child: Material(
          color: Colors.transparent,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            decoration: BoxDecoration(
              color: const Color(0xFF1A1A1A),
              borderRadius: BorderRadius.circular(14),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.25),
                  blurRadius: 14,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('🚀', style: TextStyle(fontSize: 15)),
                SizedBox(width: 8),
                Text(
                  'Coming soon!',
                  style: TextStyle(
                    color: Color(0xFFFFCC00),
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
    overlay.insert(entry);
    Future.delayed(const Duration(seconds: 2), entry.remove);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          top: BorderSide(color: Color(0xFFEEEEEE), width: 1),
        ),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 56,
          child: Row(
            children: [
              _buildTab(
                index: 0,
                icon: Icons.home_outlined,
                activeIcon: Icons.home_rounded,
              ),
              _buildTab(
                index: 1,
                icon: Icons.fitness_center_outlined,
                activeIcon: Icons.fitness_center_rounded,
              ),
              _buildBellTab(),
              _buildTab(
                index: 3,
                icon: Icons.person_outline_rounded,
                activeIcon: Icons.person_rounded,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ── Standard tab ──────────────────────────────────────────────────
  Widget _buildTab({
    required int index,
    required IconData icon,
    required IconData activeIcon,
  }) {
    final active = widget.currentIndex == index;
    final justTapped = _tappedIndex == index;

    return Expanded(
      child: GestureDetector(
        onTap: () => _onTap(index),
        behavior: HitTestBehavior.opaque,
        child: AnimatedBuilder(
          animation: _scaleController,
          builder: (_, __) {
            final scale = justTapped ? _scaleAnim.value : 1.0;
            return Transform.scale(
              scale: scale,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Active indicator line on top
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    height: 2.5,
                    width: active ? 28 : 0,
                    margin: const EdgeInsets.only(bottom: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFCC00),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  Icon(
                    active ? activeIcon : icon,
                    size: 25,
                    color: active
                        ? const Color(0xFFFFCC00)
                        : const Color(0xFFAAAAAA),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  // ── Bell tab with shake animation ─────────────────────────────────
  Widget _buildBellTab() {
    const index = 2;
    final active = widget.currentIndex == index;
    final justTapped = _tappedIndex == index;

    return Expanded(
      child: GestureDetector(
        onTap: () => _onTap(index),
        behavior: HitTestBehavior.opaque,
        child: AnimatedBuilder(
          animation: Listenable.merge([_scaleController, _bellController]),
          builder: (_, __) {
            final scale = justTapped ? _scaleAnim.value : 1.0;
            // Shake: oscillate left and right
            final shake = _bellAnim.value;
            final angle = shake == 0.0
                ? 0.0
                : (0.3 * (shake < 0.5 ? shake : 1.0 - shake) *
                (shake * 20 % 2 < 1 ? 1 : -1));

            return Transform.scale(
              scale: scale,
              child: Transform.rotate(
                angle: angle,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Active indicator
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      height: 2.5,
                      width: active ? 28 : 0,
                      margin: const EdgeInsets.only(bottom: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFCC00),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                    Stack(
                      clipBehavior: Clip.none,
                      children: [
                        Icon(
                          active
                              ? Icons.notifications_rounded
                              : Icons.notifications_outlined,
                          size: 25,
                          color: active
                              ? const Color(0xFFFFCC00)
                              : const Color(0xFFAAAAAA),
                        ),
                        // Yellow notification dot
                        Positioned(
                          top: -1,
                          right: -2,
                          child: Container(
                            width: 7,
                            height: 7,
                            decoration: const BoxDecoration(
                              color: Color(0xFFFFCC00),
                              shape: BoxShape.circle,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}