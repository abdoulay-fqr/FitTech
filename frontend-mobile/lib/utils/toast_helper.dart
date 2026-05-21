import 'package:flutter/material.dart';

class ToastHelper {
  static OverlayEntry? _currentEntry;

  static void showError(BuildContext context, String message) {
    _show(context, message, const Color(0xFFD32F2F), Icons.error_outline);
  }

  static void showSuccess(BuildContext context, String message) {
    _show(context, message, const Color(0xFF388E3C), Icons.check_circle_outline);
  }

  static void _show(BuildContext context, String message, Color color, IconData icon) {
    _currentEntry?.remove();
    _currentEntry = null;

    final overlay = Overlay.of(context);
    final key = GlobalKey<_ToastWidgetState>();

    _currentEntry = OverlayEntry(
      builder: (context) => Positioned(
        top: MediaQuery.of(context).padding.top + 60,
        left: 16,
        right: 16,
        child: _ToastWidget(
          key: key,
          message: message,
          color: color,
          icon: icon,
        ),
      ),
    );

    overlay.insert(_currentEntry!);

    // Start fade out after 4 seconds, remove after 5
    Future.delayed(const Duration(seconds: 1), () {
      key.currentState?.fadeOut();
    });

    Future.delayed(const Duration(seconds: 2), () {
      _currentEntry?.remove();
      _currentEntry = null;
    });
  }
}

class _ToastWidget extends StatefulWidget {
  final String message;
  final Color color;
  final IconData icon;

  const _ToastWidget({
    super.key,
    required this.message,
    required this.color,
    required this.icon,
  });

  @override
  State<_ToastWidget> createState() => _ToastWidgetState();
}

class _ToastWidgetState extends State<_ToastWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacity;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
      value: 1.0,
    );
    _opacity = CurvedAnimation(parent: _controller, curve: Curves.easeOut);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void fadeOut() {
    _controller.reverse();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _opacity,
      child: Material(
        color: Colors.transparent,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          decoration: BoxDecoration(
            color: widget.color,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.15),
                blurRadius: 8,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Row(
            children: [
              Icon(widget.icon, color: Colors.white, size: 22),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  widget.message,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}