class Validators {
  // ── Email ──────────────────────────────────────────────────────
  static String? email(String value) {
    if (value.isEmpty) return 'Email is required';
    final regex = RegExp(r'^[\w.-]+@[\w.-]+\.\w{2,}$');
    if (!regex.hasMatch(value)) return 'Please enter a valid email address';
    return null;
  }

  // ── Password ───────────────────────────────────────────────────
  static String? password(String value) {
    if (value.isEmpty) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return null;
  }

  // ── Name ───────────────────────────────────────────────────────
  static String? name(String value, String fieldName) {
    if (value.isEmpty) return '$fieldName is required';
    if (value.length < 2) return '$fieldName must be at least 2 characters';
    final regex = RegExp(r"^[a-zA-ZÀ-ÿ\s'-]+$");
    if (!regex.hasMatch(value)) return '$fieldName must contain letters only';
    return null;
  }
}