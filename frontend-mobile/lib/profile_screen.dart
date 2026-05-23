import 'dart:io';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';
import 'bottom_nav.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _isLoading = true;
  Map<String, dynamic>? _member;
  String? _memberId;
  String _email = '';

  // Photo
  String? _localPhotoPath;
  Map<String, String> _photoHeaders = {};

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    final prefs = await SharedPreferences.getInstance();
    _email = prefs.getString('email') ?? '';

    // Load local photo path (saved after upload)
    final path = prefs.getString('photoPath');
    if (path != null && File(path).existsSync()) {
      _localPhotoPath = path;
    }

    final result = await ApiService().getMemberProfile();
    if (mounted) {
      setState(() {
        _isLoading = false;
        if (result.success && result.data != null) {
          _member = result.data;
          _memberId = result.data['id'];
        }
      });

      // Load auth headers for network image (non-blocking)
      final headers = await ApiService().getProfilePhotoHeaders();
      if (mounted) setState(() => _photoHeaders = headers);
    }
  }

  String _formatGender(String? g) {
    if (g == 'MALE') return 'Man';
    if (g == 'FEMALE') return 'Woman';
    return g ?? '—';
  }

  String _fullName() {
    final first  = _member?['firstName'] ?? '';
    final second = _member?['secondName'] ?? '';
    final full   = '$first $second'.trim();
    return full.isEmpty ? '—' : full;
  }

  // ════════════════════════════════════════════════════════════════
  // PHOTO WIDGET — priority: local file → network → default asset
  // ════════════════════════════════════════════════════════════════
  Widget _buildPhotoWidget({required double size}) {
    Widget child;

    if (_localPhotoPath != null) {
      // Show locally saved file (fastest, no network needed)
      child = Image.file(
        File(_localPhotoPath!),
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => _defaultAvatar(),
      );
    } else if (_memberId != null && _memberId!.isNotEmpty && _photoHeaders.isNotEmpty) {
      // Fetch from backend with auth token
      child = Image.network(
        ApiService().getProfilePhotoUrl(_memberId!),
        headers: _photoHeaders,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => _defaultAvatar(),
        loadingBuilder: (_, child, progress) {
          if (progress == null) return child;
          return Container(
            color: const Color(0xFFFFCC00),
            child: const Center(
              child: SizedBox(width: 20, height: 20,
                  child: CircularProgressIndicator(color: Colors.black, strokeWidth: 2)),
            ),
          );
        },
      );
    } else {
      child = Image.asset(
        'assets/images/avatar_default.jpg',
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => _defaultAvatar(),
      );
    }

    return Container(
      width: size, height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: const Color(0xFFFFCC00), width: 3),
        boxShadow: [BoxShadow(
          color: const Color(0xFFFFCC00).withValues(alpha: 0.35),
          blurRadius: 14, offset: const Offset(0, 4),
        )],
      ),
      child: ClipOval(child: child),
    );
  }

  Widget _defaultAvatar() {
    return Container(
      color: const Color(0xFFFFCC00),
      child: const Icon(Icons.person_rounded, size: 48, color: Colors.black),
    );
  }

  // ════════════════════════════════════════════════════════════════
  // LOGOUT
  // ════════════════════════════════════════════════════════════════
  Future<void> _onLogout() async {
    showDialog(
      context: context,
      barrierColor: Colors.black54,
      builder: (ctx) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Déconnexion', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
              const SizedBox(height: 8),
              const Text('Voulez-vous vraiment vous déconnecter ?',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 14, color: Color(0xFF888888))),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Color(0xFFE0E0E0)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 13),
                      ),
                      onPressed: () => Navigator.pop(ctx),
                      child: const Text('Cancel', style: TextStyle(color: Color(0xFF888888), fontWeight: FontWeight.w600)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFFCC00), foregroundColor: Colors.black,
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 13),
                      ),
                      onPressed: () async {
                        Navigator.pop(ctx);
                        await ApiService().logout();
                        if (!mounted) return;
                        context.go('/signin');
                      },
                      child: const Text('Disconnect', style: TextStyle(fontWeight: FontWeight.w700)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ════════════════════════════════════════════════════════════════
  // BUILD
  // ════════════════════════════════════════════════════════════════
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
                  ? const Center(child: CircularProgressIndicator(color: Color(0xFFFFCC00), strokeWidth: 2.5))
                  : SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                child: Column(
                  children: [
                    _buildHeader(),
                    const SizedBox(height: 12),
                    _buildPersonalInfo(),
                    const SizedBox(height: 12),
                    _buildHealthProfile(),
                    const SizedBox(height: 12),
                    _buildMoreSection(),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNav(currentIndex: 3),
    );
  }

  Widget _buildTopBar() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      child: const Center(
        child: Text('My Account',
            style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: Color(0xFF1A1A1A))),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      width: double.infinity,
      color: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 28),
      child: Column(
        children: [
          _buildPhotoWidget(size: 88),
          const SizedBox(height: 14),
          Text(_fullName(),
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Color(0xFF1A1A1A))),
        ],
      ),
    );
  }

  Widget _buildPersonalInfo() {
    final subscriptionStatus = _member?['subscriptionStatus'] ?? '—';
    final isActive = subscriptionStatus == 'ACTIVE';
    return _card(title: 'Personal Information', children: [
      _infoRow('Email', _email.isEmpty ? '—' : _email),
      _divider(),
      _infoRow('Phone Number', _member?['phone'] ?? '—'),
      _divider(),
      _infoRow('Date of Birth', _member?['birthDate'] ?? '—'),
      _divider(),
      _infoRow('Civility', _formatGender(_member?['gender'])),
      _divider(),
      _infoRow('Plan', _member?['subscriptionPlan'] ?? '—'),
      _divider(),
      _infoRow('Status', subscriptionStatus,
          valueColor: isActive ? const Color(0xFF2ECC71) : const Color(0xFFE74C3C)),
    ]);
  }

  Widget _buildHealthProfile() {
    return _card(title: 'Health Profile', children: [
      _infoColumn('Goal', _member?['objective'] ?? '—'),
      _divider(),
      _infoColumn('Medical Restrictions', _member?['medicalRestrictions'] ?? '—'),
    ]);
  }

  Widget _buildMoreSection() {
    return _card(title: 'More', children: [
      _menuRow(
        icon: Icons.edit_outlined,
        label: 'Edit Informations',
        onTap: () async {
          final updated = await context.push<bool>(
            '/edit-profile',
            extra: {'member': _member, 'memberId': _memberId},
          );
          // Reload profile AND refresh local photo path after edit
          if (updated == true) _loadProfile();
        },
      ),
      _divider(),
      _menuRow(icon: Icons.help_outline_rounded, label: 'Help & Support', onTap: () {}),
      _divider(),
      _menuRow(icon: Icons.info_outline_rounded, label: 'About App', onTap: () {}),
      _divider(),
      _menuRow(icon: Icons.logout_rounded, label: 'Log out', onTap: _onLogout, isRed: true),
    ]);
  }

  // ════════════════════════════════════════════════════════════════
  // REUSABLE CARD WIDGETS
  // ════════════════════════════════════════════════════════════════
  Widget _card({required String title, required List<Widget> children}) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white, borderRadius: BorderRadius.circular(18),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 8, offset: const Offset(0, 2))],
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(18, 18, 18, 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF1A1A1A))),
            const SizedBox(height: 14),
            ...children,
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(String label, String value, {Color? valueColor}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 13, color: Color(0xFF888888))),
          Flexible(
            child: Text(value, textAlign: TextAlign.end,
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600,
                    color: valueColor ?? const Color(0xFF1A1A1A))),
          ),
        ],
      ),
    );
  }

  Widget _infoColumn(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 13, color: Color(0xFF888888))),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500,
              color: Color(0xFF1A1A1A), height: 1.5)),
        ],
      ),
    );
  }

  Widget _menuRow({required IconData icon, required String label, required VoidCallback onTap, bool isRed = false}) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 11),
        child: Row(
          children: [
            Container(
              width: 34, height: 34,
              decoration: BoxDecoration(
                color: isRed ? const Color(0xFFFFEEEE) : const Color(0xFFFFCC00),
                borderRadius: BorderRadius.circular(9),
              ),
              child: Icon(icon, size: 17, color: isRed ? const Color(0xFFE74C3C) : Colors.black),
            ),
            const SizedBox(width: 12),
            Expanded(child: Text(label, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600,
                color: isRed ? const Color(0xFFE74C3C) : const Color(0xFF1A1A1A)))),
            Icon(Icons.chevron_right_rounded, size: 20,
                color: isRed ? const Color(0xFFE74C3C) : const Color(0xFFCCCCCC)),
          ],
        ),
      ),
    );
  }

  Widget _divider() => const Divider(height: 1, thickness: 1, color: Color(0xFFF2F2F2));
}