import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl = 'http://192.168.100.6:8080';

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
    try {
      final response = await _dio.post(
        '/auth/register',
        data: {
          'email': email,
          'password': password,
          'firstName': firstName,
          'secondName': secondName,
          'gender': gender,
        },
      );
      await _saveToken(response.data);
      return ApiResult.success(response.data);
    } on DioException catch (e) {
      return ApiResult.error(_handleError(e));
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // 🔐 LOGIN
  // ══════════════════════════════════════════════════════════════════
  Future<ApiResult> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post(
        '/auth/login',
        data: {
          'email': email,
          'password': password,
        },
      );
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
    try {
      final response = await _dio.post(
        '/auth/forgot-password',
        data: {'email': email},
      );
      return ApiResult.success(response.data);
    } on DioException catch (e) {
      return ApiResult.error(_handleError(e));
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // 🔄 RESET PASSWORD
  // ══════════════════════════════════════════════════════════════════
  Future<ApiResult> resetPassword({
    required String token,
    required String newPassword,
  }) async {
    try {
      final response = await _dio.post(
        '/auth/reset-password',
        data: {
          'token': token,
          'newPassword': newPassword,
        },
      );
      return ApiResult.success(response.data);
    } on DioException catch (e) {
      return ApiResult.error(_handleError(e));
    }
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
  // 🗑️ LOGOUT
  // ══════════════════════════════════════════════════════════════════
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('userId');
    await prefs.remove('email');
    await prefs.remove('role');
  }

  // ══════════════════════════════════════════════════════════════════
  // ✅ IS LOGGED IN
  // ══════════════════════════════════════════════════════════════════
  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token') ?? '';
    return token.isNotEmpty;
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
        final message = e.response?.data?.toString() ?? '';
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

  factory ApiResult.success(dynamic data) =>
      ApiResult._(success: true, data: data);

  factory ApiResult.error(String message) =>
      ApiResult._(success: false, error: message);
}