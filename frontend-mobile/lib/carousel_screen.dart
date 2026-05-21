import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class CarouselScreen extends StatefulWidget {
  const CarouselScreen({super.key});

  @override
  State<CarouselScreen> createState() => _CarouselScreenState();
}

class _CarouselScreenState extends State<CarouselScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<_CarouselItem> _items = [
    _CarouselItem(
      imagePath: 'assets/images/carousel1.png',
      title: 'Comprehensive\nWorkout Zones',
      description:
      'Experience our fully equipped zones designed for strength, cardio, flexibility, and recovery. Whether you\'re building muscle, improving endurance, or relaxing after a workout, we\'ve got the perfect space for you',
    ),
    _CarouselItem(
      imagePath: 'assets/images/carousel2.png',
      title: 'Expert Coaching & Personalized Training',
      description:
      'Work with our certified coaches to receive tailored fitness plans that match your goals. Get the guidance and support you need to reach new heights in your fitness journey',
    ),
    _CarouselItem(
      imagePath: 'assets/images/carousel3.png',
      title: 'State-of-the-Art Equipment',
      description:
      'From cardio machines to free weights and resistance training gear, our gym is equipped with the latest technology to ensure effective and enjoyable workouts',
    ),
    _CarouselItem(
      imagePath: 'assets/images/carousel4.png',
      title: 'Start Your Fitness Journey',
      description:
      'Join our community today! Get expert coaching, access top equipment, and achieve your fitness goals with support every step of the way',
    ),
  ];

  void _onPageChanged(int index) {
    setState(() => _currentPage = index);
  }

  void _goToNext() {
    if (_currentPage < _items.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    } else {
      _navigateToLogin();
    }
  }

  void _navigateToLogin() {
    context.go('/signup');
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // ── Yellow decorative circle top-left ───────────────────────
          Positioned(
            top: -60,
            left: -60,
            child: Container(
              width: 220,
              height: 220,
              decoration: const BoxDecoration(
                color: Color(0xFFFFCC00),
                shape: BoxShape.circle,
              ),
            ),
          ),

          // ── Light grey decorative blob bottom-left ───────────────────
          Positioned(
            bottom: -40,
            left: -30,
            child: Container(
              width: 180,
              height: 200,
              decoration: BoxDecoration(
                color: const Color(0xFFEEF1F8),
                borderRadius: BorderRadius.circular(120),
              ),
            ),
          ),

          // ── Main content ─────────────────────────────────────────────
          SafeArea(
            child: Column(
              children: [
                // Skip button
                Align(
                  alignment: Alignment.topRight,
                  child: Padding(
                    padding: const EdgeInsets.only(right: 20, top: 12),
                    child: TextButton(
                      onPressed: _navigateToLogin,
                      child: const Text(
                        'Skip',
                        style: TextStyle(
                          color: Colors.black54,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                ),

                // ── PageView ──────────────────────────────────────────
                Expanded(
                  child: PageView.builder(
                    controller: _pageController,
                    onPageChanged: _onPageChanged,
                    itemCount: _items.length,
                    itemBuilder: (context, index) {
                      return _CarouselCard(item: _items[index]);
                    },
                  ),
                ),

                // ── Dots + Next button ────────────────────────────────
                Padding(
                  padding:
                  const EdgeInsets.symmetric(horizontal: 28, vertical: 28),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Dot indicators
                      Row(
                        children: List.generate(_items.length, (index) {
                          final bool isActive = index == _currentPage;
                          return AnimatedContainer(
                            duration: const Duration(milliseconds: 300),
                            margin: const EdgeInsets.only(right: 8),
                            width: isActive ? 24 : 10,
                            height: 10,
                            decoration: BoxDecoration(
                              color: isActive
                                  ? const Color(0xFFFFCC00)
                                  : const Color(0xFFCCCCCC),
                              borderRadius: BorderRadius.circular(5),
                            ),
                          );
                        }),
                      ),

                      // Next / Begin button
                      GestureDetector(
                        onTap: _goToNext,
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 24, vertical: 14),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFCC00),
                            borderRadius: BorderRadius.circular(30),
                          ),
                          child: Text(
                            _currentPage == _items.length - 1
                                ? 'Begin'
                                : 'Next',
                            style: const TextStyle(
                              color: Colors.black,
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Single Carousel Card ──────────────────────────────────────────────────────
class _CarouselCard extends StatelessWidget {
  final _CarouselItem item;
  const _CarouselCard({required this.item});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(28),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.10),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // ── Image — now correctly uses item.imagePath ──────────
            Expanded(
              flex: 5,
              child: ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(28),
                ),
                child: Image.asset(
                  item.imagePath, // ✅ FIXED: was hardcoded to img1.png
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => Container(
                    color: const Color(0xFFF0F0F0),
                    child: const Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.image_not_supported,
                            size: 48, color: Colors.grey),
                        SizedBox(height: 8),
                        Text(
                          'Image not found',
                          style: TextStyle(color: Colors.grey, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            // ── Text content ───────────────────────────────────────
            Expanded(
              flex: 4,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 24, 24, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Text(
                      item.title,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF1A1A1A),
                        height: 1.2,
                      ),
                    ),
                    const SizedBox(height: 14),
                    Text(
                      item.description,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 13,
                        color: Color(0xFF666666),
                        height: 1.6,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Data model ────────────────────────────────────────────────────────────────
class _CarouselItem {
  final String imagePath;
  final String title;
  final String description;

  const _CarouselItem({
    required this.imagePath,
    required this.title,
    required this.description,
  });
}