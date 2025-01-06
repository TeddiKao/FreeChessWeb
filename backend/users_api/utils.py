from django.core.mail import send_mail
import pyotp

def generate_otp():
	otp = pyotp.TOTP(pyotp.random_base32(), interval=300)

	return otp

def verify_otp(actual_otp, user_otp):
	return user_otp == actual_otp