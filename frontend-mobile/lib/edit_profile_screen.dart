import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';

class EditProfileScreen extends StatefulWidget {
  final Map<String, dynamic>? member;
  final String? memberId;

  const EditProfileScreen({super.key, this.member, this.memberId});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _firstNameCtrl    = TextEditingController();
  final _secondNameCtrl   = TextEditingController();
  final _phoneCtrl        = TextEditingController();
  final _birthDateCtrl    = TextEditingController();
  final _goalCtrl         = TextEditingController();
  final _medicalCtrl      = TextEditingController();
  final _oldPasswordCtrl  = TextEditingController();
  final _newPasswordCtrl  = TextEditingController();
  final _confirmPasswordCtrl = TextEditingController();

  String _selectedGender = 'MALE';
  bool   _isSaving       = false;

  // Photo state
  File?   _pickedPhoto;          // newly picked, not yet uploaded
  String? _localPhotoPath;       // saved path after upload
  bool    _isUploadingPhoto = false;
  String? _memberId;

  // Password visibility
  bool _showOldPass     = false;
  bool _showNewPass     = false;
  bool _showConfirmPass = false;

  // Password strength
  bool _hasMinLength    = false;
  bool _hasUppercase    = false;
  bool _hasNumber       = false;
  bool _hasSpecial      = false;
  bool _passwordsMatch  = false;
  bool _showPasswordRules = false;

  @override
  void initState() {
    super.initState();
    _memberId = widget.memberId;
    _prefill();
    _loadLocalPhoto();
    _newPasswordCtrl.addListener(_onNewPasswordChanged);
    _confirmPasswordCtrl.addListener(_onConfirmPasswordChanged);
  }

  // ── Load saved photo path from SharedPreferences ─────────────────
  Future<void> _loadLocalPhoto() async {
    final prefs = await SharedPreferences.getInstance();
    final path = prefs.getString('photoPath');
    if (path != null && File(path).existsSync()) {
      setState(() => _localPhotoPath = path);
    }
  }

  void _onNewPasswordChanged() {
    final p = _newPasswordCtrl.text;
    setState(() {
      _hasMinLength  = p.length >= 8;
      _hasUppercase  = p.contains(RegExp(r'[A-Z]'));
      _hasNumber     = p.contains(RegExp(r'[0-9]'));
      _hasSpecial    = p.contains(RegExp(r'[!@#\$%^&*(),.?":{}|<>_\-]'));
      _passwordsMatch = p.isNotEmpty && p == _confirmPasswordCtrl.text;
      _showPasswordRules = p.isNotEmpty;
    });
  }

  void _onConfirmPasswordChanged() {
    setState(() {
      _passwordsMatch = _newPasswordCtrl.text.isNotEmpty &&
          _newPasswordCtrl.text == _confirmPasswordCtrl.text;
    });
  }

  void _prefill() {
    final m = widget.member;
    if (m == null) return;
    _firstNameCtrl.text  = m['firstName'] ?? '';
    _secondNameCtrl.text = m['secondName'] ?? '';
    _phoneCtrl.text      = m['phone'] ?? '';
    _birthDateCtrl.text  = m['birthDate'] ?? '';
    _goalCtrl.text       = m['objective'] ?? '';
    _medicalCtrl.text    = m['medicalRestrictions'] ?? '';
    _selectedGender      = m['gender'] == 'FEMALE' ? 'FEMALE' : 'MALE';
  }

  @override
  void dispose() {
    _firstNameCtrl.dispose();
    _secondNameCtrl.dispose();
    _phoneCtrl.dispose();
    _birthDateCtrl.dispose();
    _goalCtrl.dispose();
    _medicalCtrl.dispose();
    _oldPasswordCtrl.dispose();
    _newPasswordCtrl.dispose();
    _confirmPasswordCtrl.dispose();
    super.dispose();
  }

  // ════════════════════════════════════════════════════════════════
  // 📸 PHOTO PICK + UPLOAD
  // ════════════════════════════════════════════════════════════════

  /// Shows bottom sheet to choose gallery or camera
  void _onAvatarTap() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Handle bar
              Container(
                width: 40, height: 4,
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: const Color(0xFFE0E0E0),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const Text(
                'Change Profile Photo',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 16),
              _sheetOption(
                icon: Icons.photo_library_outlined,
                label: 'Choose from Gallery',
                onTap: () { Navigator.pop(context); _pickPhoto(ImageSource.gallery); },
              ),
              _sheetOption(
                icon: Icons.camera_alt_outlined,
                label: 'Take a Photo',
                onTap: () { Navigator.pop(context); _pickPhoto(ImageSource.camera); },
              ),
              if (_localPhotoPath != null || _pickedPhoto != null)
                _sheetOption(
                  icon: Icons.delete_outline_rounded,
                  label: 'Remove Photo',
                  color: const Color(0xFFE74C3C),
                  onTap: () {
                    Navigator.pop(context);
                    setState(() { _pickedPhoto = null; _localPhotoPath = null; });
                  },
                ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
    );
  }

  Widget _sheetOption({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    Color color = const Color(0xFF1A1A1A),
  }) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        child: Row(
          children: [
            Container(
              width: 40, height: 40,
              decoration: BoxDecoration(
                color: color == const Color(0xFF1A1A1A)
                    ? const Color(0xFFFFF8E1)
                    : const Color(0xFFFFEEEE),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, size: 20, color: color),
            ),
            const SizedBox(width: 16),
            Text(label,
              style: TextStyle(
                  fontSize: 15, fontWeight: FontWeight.w600, color: color),
            ),
          ],
        ),
      ),
    );
  }

  /// Picks a photo then immediately uploads it
  Future<void> _pickPhoto(ImageSource source) async {
    try {
      final picker = ImagePicker();
      final picked = await picker.pickImage(
        source: source,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );
      if (picked == null) return;

      setState(() {
        _pickedPhoto = File(picked.path);
        _isUploadingPhoto = true;
      });

      // Upload immediately
      final result = await ApiService().uploadProfilePhoto(filePath: picked.path);

      if (!mounted) return;

      if (result.success) {
        // Save path locally for instant display
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('photoPath', picked.path);
        setState(() {
          _localPhotoPath = picked.path;
          _isUploadingPhoto = false;
        });
        _showPopup(success: true, message: 'Photo updated successfully!');
      } else {
        setState(() {
          _pickedPhoto = null;
          _isUploadingPhoto = false;
        });
        _showPopup(success: false, message: result.error ?? 'Failed to upload photo.');
      }
    } on PlatformException catch (e) {
      if (!mounted) return;
      setState(() => _isUploadingPhoto = false);
      // Permission denied
      if (e.code == 'photo_access_denied' || e.code == 'camera_access_denied') {
        _showPopup(success: false, message: 'Permission denied. Please allow access in Settings.');
      } else {
        _showPopup(success: false, message: 'Could not pick photo. Try again.');
      }
    } catch (_) {
      if (!mounted) return;
      setState(() => _isUploadingPhoto = false);
      _showPopup(success: false, message: 'Could not pick photo. Try again.');
    }
  }

  // ════════════════════════════════════════════════════════════════
  // VALIDATION & SAVE
  // ════════════════════════════════════════════════════════════════
  String _sanitize(String input) =>
      input.replaceAll(RegExp(r'[<>"\\/]'), '').replaceAll(RegExp(r'\s+'), ' ').trim();

  String _sanitizeName(String input) =>
      input.replaceAll(RegExp(r"[^a-zA-ZÀ-ÿ\s\-']"), '').replaceAll(RegExp(r'\s+'), ' ').trim();

  String _sanitizePhone(String input) =>
      input.replaceAll(RegExp(r'[^\d\+\s\-\(\)]'), '').trim();

  String? _validatePersonalInfo() {
    final firstName  = _firstNameCtrl.text.trim();
    final secondName = _secondNameCtrl.text.trim();
    final phone      = _phoneCtrl.text.trim();
    if (firstName.isEmpty) return 'First name is required.';
    if (firstName.length < 2) return 'First name must be at least 2 characters.';
    if (firstName.length > 50) return 'First name is too long.';
    if (!RegExp(r"^[a-zA-ZÀ-ÿ\s\-']+$").hasMatch(firstName)) return 'First name contains invalid characters.';
    if (secondName.isEmpty) return 'Second name is required.';
    if (secondName.length < 2) return 'Second name must be at least 2 characters.';
    if (secondName.length > 50) return 'Second name is too long.';
    if (!RegExp(r"^[a-zA-ZÀ-ÿ\s\-']+$").hasMatch(secondName)) return 'Second name contains invalid characters.';
    if (phone.isNotEmpty && !RegExp(r'^[\d\+\s\-\(\)]{7,20}$').hasMatch(phone)) return 'Phone number is invalid.';
    return null;
  }

  String? _validatePassword() {
    final old     = _oldPasswordCtrl.text;
    final newPass = _newPasswordCtrl.text;
    final confirm = _confirmPasswordCtrl.text;
    if (old.isEmpty && newPass.isEmpty && confirm.isEmpty) return null;
    if (old.isEmpty) return 'Please enter your current password.';
    if (newPass.isEmpty) return 'Please enter a new password.';
    if (confirm.isEmpty) return 'Please confirm your new password.';
    if (newPass.length < 8) return 'New password must be at least 8 characters.';
    if (!newPass.contains(RegExp(r'[A-Z]'))) return 'New password must contain at least one uppercase letter.';
    if (!newPass.contains(RegExp(r'[0-9]'))) return 'New password must contain at least one number.';
    if (!newPass.contains(RegExp(r'[!@#\$%^&*(),.?":{}|<>_\-]'))) return 'New password must contain at least one special character.';
    if (newPass != confirm) return 'New passwords do not match.';
    if (newPass == old) return 'New password must be different from current password.';
    return null;
  }

  Future<void> _onSave() async {
    final personalError = _validatePersonalInfo();
    if (personalError != null) { _showPopup(success: false, message: personalError); return; }
    final passwordError = _validatePassword();
    if (passwordError != null) { _showPopup(success: false, message: passwordError); return; }

    setState(() => _isSaving = true);

    final result = await ApiService().updateMemberProfile(
      memberId: widget.memberId ?? '',
      firstName: _sanitizeName(_firstNameCtrl.text),
      secondName: _sanitizeName(_secondNameCtrl.text),
      phone: _sanitizePhone(_phoneCtrl.text),
      birthDate: _sanitize(_birthDateCtrl.text),
      gender: _selectedGender,
      objective: _sanitize(_goalCtrl.text),
      medicalRestrictions: _sanitize(_medicalCtrl.text),
    );

    if (!mounted) return;
    if (!result.success) {
      setState(() => _isSaving = false);
      _showPopup(success: false, message: result.error ?? 'Failed to update profile.');
      return;
    }

    if (_oldPasswordCtrl.text.isNotEmpty && _newPasswordCtrl.text.isNotEmpty) {
      final passResult = await ApiService().changePassword(
        oldPassword: _oldPasswordCtrl.text,
        newPassword: _newPasswordCtrl.text,
      );
      if (!mounted) return;
      if (!passResult.success) {
        setState(() => _isSaving = false);
        _showPopup(success: false, message: passResult.error ?? 'Password change failed.');
        return;
      }
    }

    if (!mounted) return;
    setState(() => _isSaving = false);
    _showPopup(success: true, message: 'Changes saved successfully!');
    Future.delayed(const Duration(seconds: 2), () { if (mounted) context.pop(true); });
  }

  // ── Floating popup ───────────────────────────────────────────────
  void _showPopup({required bool success, required String message}) {
    final overlay = Overlay.of(context);
    final entry = OverlayEntry(
      builder: (_) => Positioned(
        top: MediaQuery.of(context).padding.top + 12,
        left: 20, right: 20,
        child: Material(
          color: Colors.transparent,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
            decoration: BoxDecoration(
              color: success ? const Color(0xFF2ECC71) : const Color(0xFFE74C3C),
              borderRadius: BorderRadius.circular(14),
              boxShadow: [BoxShadow(
                color: (success ? const Color(0xFF2ECC71) : const Color(0xFFE74C3C)).withValues(alpha: 0.35),
                blurRadius: 12, offset: const Offset(0, 4),
              )],
            ),
            child: Row(children: [
              Icon(success ? Icons.check_circle_outline : Icons.error_outline, color: Colors.white, size: 20),
              const SizedBox(width: 10),
              Expanded(child: Text(message, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600))),
            ]),
          ),
        ),
      ),
    );
    overlay.insert(entry);
    Future.delayed(const Duration(seconds: 3), entry.remove);
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime(1995),
      firstDate: DateTime(1950),
      lastDate: DateTime.now(),
      builder: (context, child) => Theme(
        data: ThemeData.light().copyWith(
          colorScheme: const ColorScheme.light(primary: Color(0xFFFFCC00), onPrimary: Colors.black),
        ),
        child: child!,
      ),
    );
    if (picked != null) {
      setState(() {
        _birthDateCtrl.text =
        '${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}';
      });
    }
  }

  // ════════════════════════════════════════════════════════════════
  // BUILD
  // ════════════════════════════════════════════════════════════════
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      resizeToAvoidBottomInset: true,
      body: SafeArea(
        child: Column(
          children: [
            _buildTopBar(),
            Expanded(
              child: GestureDetector(
                onTap: () => FocusScope.of(context).unfocus(),
                child: SingleChildScrollView(
                  keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
                  physics: const BouncingScrollPhysics(),
                  padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom + 40),
                  child: Column(
                    children: [
                      const SizedBox(height: 24),
                      _buildAvatar(),
                      const SizedBox(height: 24),
                      _buildSection('Personal Information', [
                        _field('First Name *', _firstNameCtrl,
                            inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r"[a-zA-ZÀ-ÿ\s\-']"))]),
                        _field('Second Name *', _secondNameCtrl,
                            inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r"[a-zA-ZÀ-ÿ\s\-']"))]),
                        _field('Email',
                            TextEditingController(text: widget.member?['email'] ?? ''),
                            readOnly: true, hint: 'Cannot be changed'),
                        _genderPicker(),
                        _field('Phone Number', _phoneCtrl,
                            keyboardType: TextInputType.phone,
                            inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'[\d\+\s\-\(\)]'))]),
                        _datePicker(),
                      ]),
                      const SizedBox(height: 16),
                      _buildSection('Health Profile', [
                        _field('Goal', _goalCtrl, maxLines: 3),
                        _field('Medical Restrictions', _medicalCtrl, maxLines: 3),
                      ]),
                      const SizedBox(height: 16),
                      _buildSection('Security', [
                        _passwordField('Current Password', _oldPasswordCtrl, _showOldPass,
                                () => setState(() => _showOldPass = !_showOldPass)),
                        _passwordField('New Password', _newPasswordCtrl, _showNewPass,
                                () => setState(() => _showNewPass = !_showNewPass)),
                        if (_showPasswordRules) _buildPasswordRules(),
                        _passwordField('Confirm New Password', _confirmPasswordCtrl, _showConfirmPass,
                                () => setState(() => _showConfirmPass = !_showConfirmPass)),
                        if (_confirmPasswordCtrl.text.isNotEmpty) _buildMatchIndicator(),
                      ]),
                      const SizedBox(height: 28),
                      _saveButton(),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ════════════════════════════════════════════════════════════════
  // AVATAR WIDGET
  // ════════════════════════════════════════════════════════════════
  Widget _buildAvatar() {
    // Determine which image to show:
    // 1. Newly picked (not yet confirmed) → show _pickedPhoto
    // 2. Saved local path → show _localPhotoPath
    // 3. Network photo from backend → show URL with auth
    // 4. Default avatar asset
    Widget photoWidget;

    if (_pickedPhoto != null) {
      photoWidget = Image.file(_pickedPhoto!, fit: BoxFit.cover);
    } else if (_localPhotoPath != null) {
      photoWidget = Image.file(File(_localPhotoPath!), fit: BoxFit.cover);
    } else if (_memberId != null && _memberId!.isNotEmpty) {
      final url = ApiService().getProfilePhotoUrl(_memberId!);
      photoWidget = FutureBuilder<Map<String, String>>(
        future: ApiService().getProfilePhotoHeaders(),
        builder: (_, snap) {
          if (!snap.hasData) {
            return Container(color: const Color(0xFFFFCC00),
                child: const Icon(Icons.person_rounded, size: 50, color: Colors.black));
          }
          return Image.network(
            url,
            headers: snap.data!,
            fit: BoxFit.cover,
            errorBuilder: (_, __, ___) => Container(
              color: const Color(0xFFFFCC00),
              child: const Icon(Icons.person_rounded, size: 50, color: Colors.black),
            ),
          );
        },
      );
    } else {
      photoWidget = Image.asset('assets/images/avatar_default.jpg', fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => Container(
          color: const Color(0xFFFFCC00),
          child: const Icon(Icons.person_rounded, size: 50, color: Colors.black),
        ),
      );
    }

    return GestureDetector(
      onTap: _isUploadingPhoto ? null : _onAvatarTap,
      child: Stack(
        children: [
          Container(
            width: 90, height: 90,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFFFCC00), width: 3),
              boxShadow: [BoxShadow(
                color: const Color(0xFFFFCC00).withValues(alpha: 0.3),
                blurRadius: 14, offset: const Offset(0, 4),
              )],
            ),
            child: ClipOval(child: photoWidget),
          ),
          // Upload spinner overlay
          if (_isUploadingPhoto)
            Positioned.fill(
              child: Container(
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.black45,
                ),
                child: const Center(
                  child: SizedBox(
                    width: 24, height: 24,
                    child: CircularProgressIndicator(color: Color(0xFFFFCC00), strokeWidth: 2.5),
                  ),
                ),
              ),
            ),
          // Camera badge (hidden while uploading)
          if (!_isUploadingPhoto)
            Positioned(
              bottom: 0, right: 0,
              child: Container(
                width: 28, height: 28,
                decoration: BoxDecoration(
                  color: const Color(0xFF1A1A1A),
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 2),
                ),
                child: const Icon(Icons.camera_alt_rounded, size: 14, color: Colors.white),
              ),
            ),
        ],
      ),
    );
  }

  // ════════════════════════════════════════════════════════════════
  // REUSABLE WIDGETS (unchanged from original)
  // ════════════════════════════════════════════════════════════════
  Widget _buildTopBar() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
      child: Row(
        children: [
          IconButton(
            onPressed: () => context.pop(),
            icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.black),
          ),
          const Expanded(
            child: Text('Edit Profile',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: Color(0xFF1A1A1A))),
          ),
          const SizedBox(width: 48),
        ],
      ),
    );
  }

  Widget _buildSection(String title, List<Widget> children) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 8, offset: const Offset(0, 2))],
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF1A1A1A))),
            const SizedBox(height: 16),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _field(String label, TextEditingController ctrl, {
    bool readOnly = false, String? hint, int maxLines = 1,
    TextInputType? keyboardType, List<TextInputFormatter>? inputFormatters,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF888888))),
          const SizedBox(height: 6),
          TextField(
            controller: ctrl, readOnly: readOnly, maxLines: maxLines,
            keyboardType: keyboardType, inputFormatters: inputFormatters,
            maxLength: maxLines > 1 ? 500 : 100,
            style: const TextStyle(fontSize: 14, color: Color(0xFF1A1A1A), fontWeight: FontWeight.w500),
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: const TextStyle(color: Color(0xFFCCCCCC)),
              filled: true, counterText: '',
              fillColor: readOnly ? const Color(0xFFF8F8F8) : const Color(0xFFFAFAFA),
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE8E8E8))),
              enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE8E8E8))),
              focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFFFCC00), width: 1.5)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _passwordField(String label, TextEditingController ctrl, bool visible, VoidCallback onToggle) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF888888))),
          const SizedBox(height: 6),
          TextField(
            controller: ctrl, obscureText: !visible, maxLength: 128,
            style: const TextStyle(fontSize: 14, color: Color(0xFF1A1A1A)),
            decoration: InputDecoration(
              filled: true, counterText: '', fillColor: const Color(0xFFFAFAFA),
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE8E8E8))),
              enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE8E8E8))),
              focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFFFCC00), width: 1.5)),
              suffixIcon: IconButton(
                icon: Icon(visible ? Icons.visibility_off_outlined : Icons.visibility_outlined, color: const Color(0xFF888888), size: 20),
                onPressed: onToggle,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _genderPicker() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Civility', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF888888))),
          const SizedBox(height: 8),
          Row(children: [
            _genderOption('Man', 'MALE'),
            const SizedBox(width: 20),
            _genderOption('Woman', 'FEMALE'),
          ]),
        ],
      ),
    );
  }

  Widget _genderOption(String label, String value) {
    final selected = _selectedGender == value;
    return GestureDetector(
      onTap: () => setState(() => _selectedGender = value),
      child: Row(
        children: [
          Container(
            width: 20, height: 20,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: selected ? const Color(0xFFFFCC00) : const Color(0xFFCCCCCC), width: 2),
            ),
            child: selected
                ? Center(child: Container(width: 10, height: 10,
                decoration: const BoxDecoration(color: Color(0xFFFFCC00), shape: BoxShape.circle)))
                : null,
          ),
          const SizedBox(width: 6),
          Text(label, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600,
              color: selected ? const Color(0xFF1A1A1A) : const Color(0xFF888888))),
        ],
      ),
    );
  }

  Widget _datePicker() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Date of Birth', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF888888))),
          const SizedBox(height: 6),
          GestureDetector(
            onTap: _pickDate,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
              decoration: BoxDecoration(
                color: const Color(0xFFFAFAFA),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE8E8E8)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    _birthDateCtrl.text.isEmpty ? 'Select date' : _birthDateCtrl.text,
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500,
                        color: _birthDateCtrl.text.isEmpty ? const Color(0xFFCCCCCC) : const Color(0xFF1A1A1A)),
                  ),
                  const Icon(Icons.calendar_today_outlined, size: 18, color: Color(0xFF888888)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPasswordRules() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: const Color(0xFFF8F8F8), borderRadius: BorderRadius.circular(10),
          border: Border.all(color: const Color(0xFFE8E8E8)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Password requirements:',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF888888))),
            const SizedBox(height: 8),
            _ruleRow('At least 8 characters', _hasMinLength),
            _ruleRow('At least one uppercase letter (A-Z)', _hasUppercase),
            _ruleRow('At least one number (0-9)', _hasNumber),
            _ruleRow('At least one special character (!@#\$...)', _hasSpecial),
          ],
        ),
      ),
    );
  }

  Widget _ruleRow(String text, bool passed) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        children: [
          Icon(
            passed ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded,
            size: 14, color: passed ? const Color(0xFF2ECC71) : const Color(0xFFCCCCCC),
          ),
          const SizedBox(width: 6),
          Text(text, style: TextStyle(fontSize: 11,
              color: passed ? const Color(0xFF2ECC71) : const Color(0xFF888888),
              fontWeight: passed ? FontWeight.w600 : FontWeight.w400)),
        ],
      ),
    );
  }

  Widget _buildMatchIndicator() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Icon(
            _passwordsMatch ? Icons.check_circle_rounded : Icons.cancel_rounded,
            size: 14, color: _passwordsMatch ? const Color(0xFF2ECC71) : const Color(0xFFE74C3C),
          ),
          const SizedBox(width: 6),
          Text(
            _passwordsMatch ? 'Passwords match' : 'Passwords do not match',
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600,
                color: _passwordsMatch ? const Color(0xFF2ECC71) : const Color(0xFFE74C3C)),
          ),
        ],
      ),
    );
  }

  Widget _saveButton() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: SizedBox(
        width: double.infinity,
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFFFCC00), foregroundColor: Colors.black,
            elevation: 0, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            padding: const EdgeInsets.symmetric(vertical: 16),
          ),
          onPressed: _isSaving ? null : _onSave,
          child: _isSaving
              ? const SizedBox(height: 20, width: 20,
              child: CircularProgressIndicator(color: Colors.black, strokeWidth: 2))
              : const Text('Save Changes', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
        ),
      ),
    );
  }
}