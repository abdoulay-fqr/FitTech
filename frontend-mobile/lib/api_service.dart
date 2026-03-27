import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/foundation.dart';
class ApiService {
  static const String baseUrl = 'http://192.168.1.7:8080';

  static const bool _mockMode = false;

  final Dio _dio = Dio(
    BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {'Content-Type': 'application/json'},
    ),
  );

  // ══════════════════════════════════════════════════════════════════
  // 📝 REGISTER
  // ══════════════════════════════════════════════════════════════════
  Future<ApiResult> register({
    required String email,
    required String password,
    required String firstName,
    required String secondName,
    required String gender,
  }) async {
    if (_mockMode) {
      await Future.delayed(const Duration(milliseconds: 800));
      final mockData = {'token': 'mock-token-123', 'id': 'mock-user-id-001', 'email': email, 'role': 'MEMBRE'};
      await _saveToken(mockData);
      return ApiResult.success(mockData);
    }
    try {
      final response = await _dio.post('/auth/register', data: {
        'email': email, 'password': password,
        'firstName': firstName, 'secondName': secondName, 'gender': gender,
      });
      await _saveToken(response.data);
      return ApiResult.success(response.data);
    } on DioException catch (e) {
      return ApiResult.error(_handleError(e));
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // 🔐 LOGIN
  // ══════════════════════════════════════════════════════════════════
  Future<ApiResult> login({required String email, required String password}) async {
    if (_mockMode) {
      await Future.delayed(const Duration(milliseconds: 800));
      if (password.length < 3) return ApiResult.error('Invalid credentials or access denied.');
      final mockData = {'token': 'mock-token-123', 'id': 'mock-user-id-001', 'email': email, 'role': 'MEMBRE'};
      await _saveToken(mockData);
      return ApiResult.success(mockData);
    }
    try {
      final response = await _dio.post('/auth/login', data: {'email': email, 'password': password, 'platform': 'MOBILE'});
      await _saveToken(response.data);
      return ApiResult.success(response.data);
    } on DioException catch (e) {
      return ApiResult.error(_handleError(e));
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // 🔑 FORGOT PASSWORD
  // ══════════════════════════════════════════════════════════════════
  Future<ApiResult> forgotPassword({required String email}) async {
    if (_mockMode) { await Future.delayed(const Duration(milliseconds: 800)); return ApiResult.success('Reset email sent'); }
    try {
      final response = await _dio.post('/auth/forgot-password', data: {'email': email});
      return ApiResult.success(response.data);
    } on DioException catch (e) { return ApiResult.error(_handleError(e)); }
  }

  // ══════════════════════════════════════════════════════════════════
  // 🔄 RESET PASSWORD
  // ══════════════════════════════════════════════════════════════════
  Future<ApiResult> resetPassword({required String token, required String newPassword}) async {
    if (_mockMode) { await Future.delayed(const Duration(milliseconds: 800)); return ApiResult.success('Password reset successfully'); }
    try {
      final response = await _dio.post('/auth/reset-password', data: {'token': token, 'newPassword': newPassword});
      return ApiResult.success(response.data);
    } on DioException catch (e) { return ApiResult.error(_handleError(e)); }
  }

  // ══════════════════════════════════════════════════════════════════
  // 🔒 CHANGE PASSWORD
  // PUT /auth/change-password
  // ══════════════════════════════════════════════════════════════════
  Future<ApiResult> changePassword({required String oldPassword, required String newPassword}) async {
    if (_mockMode) { await Future.delayed(const Duration(milliseconds: 800)); return ApiResult.success('Password changed'); }
    try {
      final token = await _getToken();
      final response = await _dio.put('/auth/change-password',
        data: {'oldPassword': oldPassword, 'newPassword': newPassword},
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      return ApiResult.success(response.data);
    } on DioException catch (e) { return ApiResult.error(_handleError(e)); }
  }

  // ══════════════════════════════════════════════════════════════════
  // 👤 GET MEMBER PROFILE
  // GET /users/members/me
  // ══════════════════════════════════════════════════════════════════
  Future<ApiResult> getMemberProfile() async {
    if (_mockMode) {
      await Future.delayed(const Duration(milliseconds: 600));
      final prefs = await SharedPreferences.getInstance();
      return ApiResult.success({
        'id': 'mock-member-id-001', 'authId': 'mock-user-id-001',
        'firstName': 'HOUARI', 'secondName': 'Messaoud',
        'email': prefs.getString('email') ?? 'member@gym.com',
        'phone': '+213 737 286 945', 'birthDate': '1993-07-17',
        'gender': 'MALE', 'objective': 'Lose 10kg in 6 months.',
        'medicalRestrictions': 'Lower back pain.', 'nfcCardId': 'NFC-001',
        'nfcActive': true, 'suspended': false,
        'subscriptionPlan': 'MONTHLY', 'subscriptionStatus': 'ACTIVE',
      });
    }
    try {
      final token = await _getToken();
      final response = await _dio.get('/users/members/me',
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      return ApiResult.success(response.data);
    } on DioException catch (e) { return ApiResult.error(_handleError(e)); }
  }

  // ══════════════════════════════════════════════════════════════════
  // ✏️ UPDATE MEMBER PROFILE
  // PUT /users/members/me
  // ══════════════════════════════════════════════════════════════════
  Future<ApiResult> updateMemberProfile({
    required String memberId,
    String? firstName, String? secondName, String? phone,
    String? birthDate, String? gender, String? objective, String? medicalRestrictions,
  }) async {
    if (_mockMode) {
      await Future.delayed(const Duration(milliseconds: 800));
      return ApiResult.success({'id': memberId, 'firstName': firstName, 'secondName': secondName});
    }
    try {
      final token = await _getToken();
      final data = <String, dynamic>{};
      if (firstName != null) data['firstName'] = firstName;
      if (secondName != null) data['secondName'] = secondName;
      if (phone != null) data['phone'] = phone;
      if (birthDate != null) data['birthDate'] = birthDate;
      if (gender != null) data['gender'] = gender;
      if (objective != null) data['objective'] = objective;
      if (medicalRestrictions != null) data['medicalRestrictions'] = medicalRestrictions;
      final response = await _dio.put('/users/members/me', data: data,
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      return ApiResult.success(response.data);
    } on DioException catch (e) { return ApiResult.error(_handleError(e)); }
  }

  // ══════════════════════════════════════════════════════════════════
  // 📸 UPLOAD PROFILE PHOTO
  // POST /users/members/me/pic   (multipart, field: "file")
  // ══════════════════════════════════════════════════════════════════
  Future<ApiResult> uploadProfilePhoto({required String filePath}) async {
    if (_mockMode) {
      await Future.delayed(const Duration(milliseconds: 1000));
      return ApiResult.success({'message': 'Photo uploaded (mock)'});
    }
    try {
      final token = await _getToken();
      debugPrint('📸 Token: ${token.isEmpty ? "EMPTY!" : token.substring(0, 20)}...');

      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(filePath),
      });

      // Use a separate Dio without hardcoded Content-Type so multipart boundary is set correctly
      final uploadDio = Dio(BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
      ));

      final response = await uploadDio.post(
        '/users/members/me/pic',
        data: formData,
        options: Options(
          headers: {'Authorization': 'Bearer $token'},
        ),
      );
      debugPrint('📸 Upload success: \${response.statusCode}');
      return ApiResult.success(response.data);
    } on DioException catch (e) {
      debugPrint('📸 Upload failed: ' + (e.response?.statusCode?.toString() ?? 'null') + ' — ' + (e.response?.data?.toString() ?? e.message ?? 'unknown'));      return ApiResult.error(_handleError(e));
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // 🖼️ GET PROFILE PHOTO URL
  // GET /users/files/members/{memberId}
  // Call this to build the network image URL with auth header.
  // Use getProfilePhotoHeaders() alongside for authenticated requests.
  // ══════════════════════════════════════════════════════════════════
  String getProfilePhotoUrl(String memberId) {
    return '$baseUrl/users/files/members/$memberId';
  }

  Future<Map<String, String>> getProfilePhotoHeaders() async {
    final token = await _getToken();
    return {'Authorization': 'Bearer $token'};
  }

  // ══════════════════════════════════════════════════════════════════
  // 🎟️ FREE TRIAL
  // ══════════════════════════════════════════════════════════════════
  Future<ApiResult> freeTrial({required String fullName, required String email}) async {
    if (_mockMode) {
      await Future.delayed(const Duration(milliseconds: 800));
      return ApiResult.success({'success': true, 'data': {'id': 'mock-trial-001'}});
    }
    try {
      final response = await _dio.post('/users/trials', data: {'fullName': fullName, 'email': email});
      return ApiResult.success(response.data);
    } on DioException catch (e) { return ApiResult.error(_handleError(e)); }
  }

  // ══════════════════════════════════════════════════════════════════
  // 🔍 CHECK FREE TRIAL
  // ══════════════════════════════════════════════════════════════════
  Future<ApiResult> checkFreeTrial({required String email}) async {
    if (_mockMode) { return ApiResult.success({'exists': false, 'used': false}); }
    try {
      final response = await _dio.get('/users/trials/check', queryParameters: {'email': email});
      return ApiResult.success(response.data);
    } on DioException catch (e) { return ApiResult.error(_handleError(e)); }
  }

  // ══════════════════════════════════════════════════════════════════
  // 💾 SAVE TOKEN
  // ══════════════════════════════════════════════════════════════════
  Future<void> _saveToken(dynamic data) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', data['token'] ?? '');
    await prefs.setString('userId', data['id'] ?? '');
    await prefs.setString('email', data['email'] ?? '');
    await prefs.setString('role', data['role'] ?? '');
  }

  // ══════════════════════════════════════════════════════════════════
  // 🗑️ LOGOUT — also clears local photo path
  // ══════════════════════════════════════════════════════════════════
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('userId');
    await prefs.remove('email');
    await prefs.remove('role');
    await prefs.remove('photoPath');
  }

  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return (prefs.getString('token') ?? '').isNotEmpty;
  }

  Future<String> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token') ?? '';
  }

  // ══════════════════════════════════════════════════════════════════
  // ⚠️ ERROR HANDLER
  // ══════════════════════════════════════════════════════════════════
  String _handleError(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.receiveTimeout:
        return 'Connection timeout. Check your network.';
      case DioExceptionType.connectionError:
        return 'Cannot connect to server. Check your network.';
      case DioExceptionType.badResponse:
        final statusCode = e.response?.statusCode;
        final data = e.response?.data;
        if (data is Map && data.containsKey('message')) return data['message'].toString();
        final message = data?.toString() ?? '';
        if (statusCode == 400) {
          if (message.contains('expired')) return 'Link expired. Please request a new one.';
          if (message.contains('invalid') || message.contains('Invalid')) return 'Invalid or already used link.';
          if (message.contains('password') || message.contains('Password')) return 'Password must be at least 6 characters.';
          if (message.contains('Email') || message.contains('email')) return 'Please enter a valid email.';
          return 'Invalid request. Please try again.';
        }
        if (statusCode == 401) return 'Invalid email or password.';
        if (statusCode == 403) return 'Access denied.';
        if (statusCode == 404) return 'Account not found.';
        if (statusCode == 409) return 'Email already registered.';
        if (statusCode == 413) return 'Photo is too large. Please choose a smaller image.';
        if (statusCode == 415) return 'Unsupported file type. Please use JPG or PNG.';
        if (statusCode == 500) return 'Server error. Try again later.';
        return 'Something went wrong.';
      default:
        return 'Something went wrong. Try again.';
    }
  }
}

// ══════════════════════════════════════════════════════════════════
// 📦 API RESULT
// ══════════════════════════════════════════════════════════════════
class ApiResult {
  final bool success;
  final dynamic data;
  final String? error;

  ApiResult._({required this.success, this.data, this.error});
  factory ApiResult.success(dynamic data) => ApiResult._(success: true, data: data);
  factory ApiResult.error(String message) => ApiResult._(success: false, error: message);
}