import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';
import 'bottom_nav.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _fullName = '';
  bool _isLoading = true;
  Map<String, dynamic>? _memberData;

  final List<double> _weeklyData = [1.5, 3.0, 2.0, 4.5, 1.0, 3.5, 2.5];
  final List<String> _days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  final DateTime _expiryDate = DateTime(2026, 4, 10);

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final prefs = await SharedPreferences.getInstance();
    final result = await ApiService().getMemberProfile();
    if (mounted) {
      setState(() {
        _isLoading = false;
        if (result.success && result.data != null) {
          _memberData = result.data;
          _fullName = result.data['fullName'] ?? prefs.getString('email') ?? '';
        }
      });
    }
  }

  // Pull to refresh
  Future<void> _onRefresh() async {
    setState(() => _isLoading = false); // keep content visible
    final result = await ApiService().getMemberProfile();
    if (mounted) {
      setState(() {
        if (result.success && result.data != null) {
          _memberData = result.data;
          _fullName = result.data['fullName'] ?? '';
        }
      });
    }
  }

  String _firstName() {
    if (_memberData == null) return '';
    final first = _memberData?['firstName'] ?? '';
    if (first.isNotEmpty) return first;
    return (_memberData?['fullName'] ?? '').split(' ').first;
  }



  int _daysLeft() => _expiryDate.difference(DateTime.now()).inDays;

  String _formatExpiry() =>
      '${_expiryDate.day.toString().padLeft(2, '0')}-'
          '${_expiryDate.month.toString().padLeft(2, '0')}-'
          '${_expiryDate.year}';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      body: SafeArea(
        child: Column(
          children: [
            _buildTopBar(),
            Expanded(
              child: _isLoading
                  ? _buildSkeleton()
                  : RefreshIndicator(
                color: const Color(0xFFFFCC00),
                backgroundColor: Colors.white,
                strokeWidth: 2.5,
                onRefresh: _onRefresh,
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(
                    parent: BouncingScrollPhysics(),
                  ),
                  padding: const EdgeInsets.only(bottom: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildWelcome(),
                      const SizedBox(height: 20),
                      _buildNextClass(),
                      const SizedBox(height: 20),
                      _buildMembershipStatus(),
                      const SizedBox(height: 20),
                      _buildStatistics(),
                      const SizedBox(height: 80),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNav(currentIndex: 0),
    );
  }

  // ── Skeleton loading ───────────────────────────────────────────────
  Widget _buildSkeleton() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 20),
          _shimmer(width: 200, height: 24),
          const SizedBox(height: 20),
          _shimmer(width: 100, height: 16),
          const SizedBox(height: 12),
          // Class card skeleton
          _shimmerCard(height: 280),
          const SizedBox(height: 20),
          _shimmer(width: 140, height: 16),
          const SizedBox(height: 12),
          // Membership skeleton
          _shimmerCard(height: 140),
          const SizedBox(height: 20),
          _shimmer(width: 100, height: 16),
          const SizedBox(height: 12),
          // Stats skeleton
          _shimmerCard(height: 200),
        ],
      ),
    );
  }

  Widget _shimmer({required double width, required double height}) {
    return _ShimmerBox(width: width, height: height, radius: 8);
  }

  Widget _shimmerCard({required double height}) {
    return _ShimmerBox(
        width: double.infinity, height: height, radius: 20);
  }

  // ── Top bar ────────────────────────────────────────────────────────
  Widget _buildTopBar() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Image.asset('assets/images/logo.png',
              height: 36,
              errorBuilder: (_, __, ___) => const Text('FIT-TECH',
                  style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: Colors.black))),
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
                color: const Color(0xFFF5F5F5),
                borderRadius: BorderRadius.circular(12)),
            child: Stack(
              children: [
                const Center(
                  child: Icon(Icons.notifications_outlined,
                      color: Colors.black87, size: 22),
                ),
                Positioned(
                  top: 8,
                  right: 8,
                  child: Container(
                    width: 7,
                    height: 7,
                    decoration: const BoxDecoration(
                        color: Color(0xFFFFCC00), shape: BoxShape.circle),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ── Welcome ────────────────────────────────────────────────────────
  Widget _buildWelcome() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
      child: Text(
        'Welcome back, ${_firstName()} !',
        style: const TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w900,
            color: Color(0xFF1A1A1A)),
      ),
    );
  }

  // ── Next Class ─────────────────────────────────────────────────────
  Widget _buildNextClass() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Next Class',
              style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF1A1A1A))),
          const SizedBox(height: 12),
          _card(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ClipRRect(
                  borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(20)),
                  child: Image.asset(
                    'assets/images/class1.jpg',
                    height: 160,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      height: 160,
                      color: const Color(0xFFE8E8E8),
                      child: const Center(
                        child: Icon(Icons.fitness_center_rounded,
                            size: 50, color: Color(0xFFFFCC00)),
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Class 01',
                          style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF1A1A1A))),
                      const SizedBox(height: 4),
                      const Text('Tuesday, 10:00 - 11:30',
                          style: TextStyle(
                              fontSize: 13, color: Color(0xFF888888))),
                      const SizedBox(height: 12),
                      Row(children: [
                        Container(
                          width: 28,
                          height: 28,
                          decoration: BoxDecoration(
                              color: const Color(0xFFFFCC00),
                              borderRadius: BorderRadius.circular(8)),
                          child: const Icon(Icons.person,
                              size: 16, color: Colors.black),
                        ),
                        const SizedBox(width: 8),
                        const Text('Coach SAHNOUN Ahmed',
                            style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF1A1A1A))),
                      ]),
                      const SizedBox(height: 14),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFFFCC00),
                            foregroundColor: Colors.black,
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12)),
                            padding:
                            const EdgeInsets.symmetric(vertical: 13),
                          ),
                          onPressed: () {},
                          child: const Text('Set Reminder',
                              style: TextStyle(
                                  fontWeight: FontWeight.w700,
                                  fontSize: 14)),
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

  // ── Membership ─────────────────────────────────────────────────────
  Widget _buildMembershipStatus() {
    final daysLeft = _daysLeft();
    final isExpiringSoon = daysLeft <= 30;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Membership Status',
              style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF1A1A1A))),
          const SizedBox(height: 12),
          _card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(children: [
                _memberRow('Plan', 'Customer plan'),
                const SizedBox(height: 14),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Expiration Date',
                        style: TextStyle(
                            fontSize: 14, color: Color(0xFF888888))),
                    Row(children: [
                      Text(_formatExpiry(),
                          style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: isExpiringSoon
                                  ? const Color(0xFFE74C3C)
                                  : const Color(0xFF1A1A1A))),
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: isExpiringSoon
                              ? const Color(0xFFFFEEEE)
                              : const Color(0xFFEEFFEE),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text('$daysLeft days left',
                            style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: isExpiringSoon
                                    ? const Color(0xFFE74C3C)
                                    : const Color(0xFF2ECC71))),
                      ),
                    ]),
                  ],
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFFCC00),
                      foregroundColor: Colors.black,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(vertical: 13),
                    ),
                    onPressed: () {},
                    child: const Text('Check Subscription',
                        style: TextStyle(
                            fontWeight: FontWeight.w700, fontSize: 14)),
                  ),
                ),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _memberRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label,
            style:
            const TextStyle(fontSize: 14, color: Color(0xFF888888))),
        Text(value,
            style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: Color(0xFF1A1A1A))),
      ],
    );
  }

  // ── Statistics ─────────────────────────────────────────────────────
  Widget _buildStatistics() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Statistics',
              style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF1A1A1A))),
          const SizedBox(height: 12),
          _card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Time Trained Weekly',
                      style: TextStyle(
                          fontSize: 13, color: Color(0xFF888888))),
                  const SizedBox(height: 6),
                  const Text('8h 40min',
                      style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF1A1A1A))),
                  const SizedBox(height: 4),
                  const Row(children: [
                    Icon(Icons.trending_up,
                        color: Color(0xFF2ECC71), size: 16),
                    SizedBox(width: 4),
                    Text('+2.45%',
                        style: TextStyle(
                            fontSize: 13,
                            color: Color(0xFF2ECC71),
                            fontWeight: FontWeight.w600)),
                  ]),
                  const SizedBox(height: 20),
                  SizedBox(height: 120, child: _buildLineChart()),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: _days
                        .map((d) => Text(d,
                        style: const TextStyle(
                            fontSize: 12,
                            color: Color(0xFF888888),
                            fontWeight: FontWeight.w600)))
                        .toList(),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Line chart (Figma style) ───────────────────────────────────────
  Widget _buildLineChart() {
    final maxVal = _weeklyData.reduce((a, b) => a > b ? a : b);
    return CustomPaint(
      painter: _LineChartPainter(data: _weeklyData, maxVal: maxVal),
      child: const SizedBox.expand(),
    );
  }

  // ── Refined card with better shadow ───────────────────────────────
  Widget _card({required Widget child}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 16,
            spreadRadius: 0,
            offset: const Offset(0, 4),
          ),
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 4,
            spreadRadius: 0,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: child,
    );
  }
}

// ── Shimmer box widget ─────────────────────────────────────────────
class _ShimmerBox extends StatefulWidget {
  final double width;
  final double height;
  final double radius;

  const _ShimmerBox(
      {required this.width, required this.height, required this.radius});

  @override
  State<_ShimmerBox> createState() => _ShimmerBoxState();
}

class _ShimmerBoxState extends State<_ShimmerBox>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _anim;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 1200))
      ..repeat();
    _anim = Tween<double>(begin: -1.5, end: 1.5).animate(
        CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _anim,
      builder: (_, __) => Container(
        width: widget.width,
        height: widget.height,
        margin: const EdgeInsets.only(bottom: 8),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(widget.radius),
          gradient: LinearGradient(
            begin: Alignment(_anim.value - 1, 0),
            end: Alignment(_anim.value, 0),
            colors: const [
              Color(0xFFEEEEEE),
              Color(0xFFF8F8F8),
              Color(0xFFEEEEEE),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Line chart painter ─────────────────────────────────────────────
class _LineChartPainter extends CustomPainter {
  final List<double> data;
  final double maxVal;

  _LineChartPainter({required this.data, required this.maxVal});

  @override
  void paint(Canvas canvas, Size size) {
    if (data.isEmpty) return;

    final fillPaint = Paint()..style = PaintingStyle.fill;
    final linePaint = Paint()
      ..color = const Color(0xFFFFCC00)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final dotPaint = Paint()
      ..color = const Color(0xFFFFCC00)
      ..style = PaintingStyle.fill;

    final points = <Offset>[];
    final step = size.width / (data.length - 1);

    for (int i = 0; i < data.length; i++) {
      final x = i * step;
      final y = size.height - (data[i] / maxVal) * size.height * 0.85;
      points.add(Offset(x, y));
    }

    // Fill gradient under line
    final fillPath = Path();
    fillPath.moveTo(points.first.dx, size.height);
    for (int i = 0; i < points.length - 1; i++) {
      final cp1 = Offset(
          (points[i].dx + points[i + 1].dx) / 2, points[i].dy);
      final cp2 = Offset(
          (points[i].dx + points[i + 1].dx) / 2, points[i + 1].dy);
      fillPath.cubicTo(
          cp1.dx, cp1.dy, cp2.dx, cp2.dy, points[i + 1].dx, points[i + 1].dy);
    }
    fillPath.lineTo(points.last.dx, size.height);
    fillPath.close();

    fillPaint.shader = LinearGradient(
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
      colors: [
        const Color(0xFFFFCC00).withOpacity(0.25),
        const Color(0xFFFFCC00).withOpacity(0.0),
      ],
    ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

    canvas.drawPath(fillPath, fillPaint);

    // Draw smooth line
    final linePath = Path();
    linePath.moveTo(points.first.dx, points.first.dy);
    for (int i = 0; i < points.length - 1; i++) {
      final cp1 = Offset(
          (points[i].dx + points[i + 1].dx) / 2, points[i].dy);
      final cp2 = Offset(
          (points[i].dx + points[i + 1].dx) / 2, points[i + 1].dy);
      linePath.cubicTo(
          cp1.dx, cp1.dy, cp2.dx, cp2.dy, points[i + 1].dx, points[i + 1].dy);
    }
    canvas.drawPath(linePath, linePaint);

    // Draw dots on each point
    for (final pt in points) {
      canvas.drawCircle(pt, 4, dotPaint);
      canvas.drawCircle(
          pt,
          4,
          Paint()
            ..color = Colors.white
            ..style = PaintingStyle.stroke
            ..strokeWidth = 2);
    }
  }

  @override
  bool shouldRepaint(_LineChartPainter old) => false;
}