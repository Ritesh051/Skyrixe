import { userDetailState } from "../reduxToolkit/Slices/ProductList/listApis";
import { toast } from "react-toastify";

// Google OAuth Integration
export const initializeGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    // Check if Google script is already loaded
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    // Load Google OAuth script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // Initialize Google OAuth
      try {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || "your-google-client-id", 
          callback: resolve,
          auto_select: false,
          cancel_on_tap_outside: false,
        });
        resolve();
      } catch (error) {
        console.error('Google OAuth initialization failed:', error);
        reject(error);
      }
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Google OAuth script:', error);
      reject(error);
    };
    
    document.head.appendChild(script);
  });
};

export const handleGoogleLogin = () => {
  return new Promise((resolve, reject) => {
    try {
      initializeGoogleAuth()
        .then(() => {
          // Create a temporary div for the Google sign-in button
          const tempDiv = document.createElement('div');
          tempDiv.id = 'temp-google-signin';
          tempDiv.style.position = 'absolute';
          tempDiv.style.left = '-9999px';
          tempDiv.style.visibility = 'hidden';
          document.body.appendChild(tempDiv);

          window.google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || "your-google-client-id",
            callback: (credentialResponse) => {
              try {
                // Clean up temporary div
                if (document.getElementById('temp-google-signin')) {
                  document.body.removeChild(tempDiv);
                }

                // Decode JWT token to get user info
                const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
                
                const userData = {
                  _id: `google_${payload.sub}`,
                  userId: `google_${payload.sub}`,
                  data: {
                    personalInfo: {
                      name: payload.name,
                      email: payload.email,
                      photo: payload.picture || "",
                      phone: "",
                      gender: "",
                      dob: "",
                    },
                    addresses: [],
                    authMethod: 'google',
                    googleId: payload.sub,
                  }
                };

                resolve({
                  success: true,
                  userData,
                  message: "Google login successful"
                });
              } catch (error) {
                console.error('Error processing Google credential:', error);
                reject({
                  success: false,
                  error: 'Failed to process Google authentication'
                });
              }
            },
            auto_select: false,
          });

          // Trigger Google One Tap or render button
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              // Fallback: render button and simulate click
              window.google.accounts.id.renderButton(tempDiv, {
                theme: 'outline',
                size: 'large',
                type: 'standard',
                text: 'signin_with',
                shape: 'rectangular',
                logo_alignment: 'left',
                width: 250,
              });

              // Auto-click the button
              setTimeout(() => {
                const button = tempDiv.querySelector('[role="button"]');
                if (button) {
                  button.click();
                } else {
                  reject({
                    success: false,
                    error: 'Google sign-in button not rendered properly'
                  });
                }
              }, 100);
            }
          });
        })
        .catch(error => {
          console.error('Google OAuth initialization failed:', error);
          reject({
            success: false,
            error: 'Failed to initialize Google authentication'
          });
        });
    } catch (error) {
      console.error('Google login error:', error);
      reject({
        success: false,
        error: 'Google authentication failed'
      });
    }
  });
};

// Facebook OAuth Integration
export const initializeFacebookSDK = () => {
  return new Promise((resolve) => {
    if (window.FB) {
      resolve();
      return;
    }

    window.fbAsyncInit = function() {
      window.FB.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID || "your-facebook-app-id",
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      resolve();
    };

    // Load Facebook SDK
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    document.head.appendChild(script);
  });
};

export const handleFacebookLogin = () => {
  return new Promise((resolve, reject) => {
    initializeFacebookSDK()
      .then(() => {
        window.FB.login((response) => {
          if (response.authResponse) {
            // Get user info
            window.FB.api('/me', { fields: 'name,email,picture.type(large)' }, (userInfo) => {
              const userData = {
                _id: `facebook_${response.authResponse.userID}`,
                userId: `facebook_${response.authResponse.userID}`,
                data: {
                  personalInfo: {
                    name: userInfo.name,
                    email: userInfo.email || '',
                    photo: userInfo.picture?.data?.url || '',
                    phone: "",
                    gender: "",
                    dob: "",
                  },
                  addresses: [],
                  authMethod: 'facebook',
                  facebookId: response.authResponse.userID,
                }
              };

              resolve({
                success: true,
                userData,
                message: "Facebook login successful"
              });
            });
          } else {
            reject({
              success: false,
              error: 'Facebook login cancelled or failed'
            });
          }
        }, { scope: 'email,public_profile' });
      })
      .catch(error => {
        console.error('Facebook SDK initialization failed:', error);
        reject({
          success: false,
          error: 'Failed to initialize Facebook authentication'
        });
      });
  });
};

// Email/Password Login API call
export const handleEmailPasswordLogin = async (email, password) => {
  try {
    // TODO: Replace with your actual email login API endpoint
    // For now, returning a mock response structure that matches your auth pattern
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required'
      };
    }

    if (!validateEmail(email)) {
      return {
        success: false,
        error: 'Please enter a valid email address'
      };
    }

    // Mock successful login response (replace with actual API call)
    const userData = {
      _id: `email_${Date.now()}`,
      userId: `email_${Date.now()}`,
      data: {
        personalInfo: {
          name: "Email User", // You'd get this from your API
          email: email,
          photo: "",
          phone: "",
          gender: "",
          dob: "",
        },
        addresses: [],
        authMethod: 'email',
      }
    };

    return {
      success: true,
      userData,
      message: 'Email login successful'
    };

    /* 
    // Uncomment and modify this when you have an actual API endpoint
    const response = await fetch('/api/auth/email-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        userData: data.user,
        message: data.message || 'Login successful'
      };
    } else {
      return {
        success: false,
        error: data.message || 'Login failed'
      };
    }
    */
  } catch (error) {
    console.error('Email login error:', error);
    return {
      success: false,
      error: 'Network error. Please try again.'
    };
  }
};

// Store user session data (compatible with your existing system)
export const storeUserSession = (userData, loginMethod, setCookie, dispatch) => {
  try {
    // Store in localStorage using your existing key names
    window.localStorage.setItem("LennyUserDetail", JSON.stringify(userData));
    window.localStorage.setItem("LoginTimer", "false");
    
    // Set cookies for remember me functionality
    setCookie("LennyCheck", true, { path: "/" }, { expires: new Date("9999-12-31") });
    
    if (loginMethod === 'mobile' && userData.data?.personalInfo?.phone) {
      setCookie("LennyPhone_number", userData.data.personalInfo.phone, { path: "/" }, { expires: new Date("9999-12-31") });
    }

    // Update Redux state
    dispatch(userDetailState(true));

    return true;
  } catch (error) {
    console.error('Error storing user session:', error);
    return false;
  }
};

// Clear user session (compatible with your existing system)
export const clearUserSession = (setCookie, dispatch) => {
  try {
    // Clear localStorage
    window.localStorage.removeItem("LennyUserDetail");
    window.localStorage.setItem("LoginTimer", "true");
    
    // Clear cookies
    setCookie("LennyCheck", false, { path: "/" });
    setCookie("LennyPhone_number", "", { path: "/" });

    // Update Redux state
    dispatch(userDetailState(false));

    return true;
  } catch (error) {
    console.error('Error clearing user session:', error);
    return false;
  }
};

// Validation utilities
export const validateMobileNumber = (mobile) => {
  const mobileRegex = /^[6-9]\d{9}$/; // Indian mobile number format
  return mobileRegex.test(mobile);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Minimum 8 characters, at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

// Format OTP timer
export const formatOtpTimer = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Helper function to create user data structure that matches your existing pattern
export const createUserDataStructure = (authData, method) => {
  const baseId = `${method}_${Date.now()}`;
  
  return {
    _id: baseId,
    userId: baseId,
    data: {
      personalInfo: {
        name: authData.name || "",
        email: authData.email || "",
        photo: authData.photo || "",
        phone: authData.phone || "",
        gender: authData.gender || "",
        dob: authData.dob || "",
      },
      addresses: [],
      authMethod: method,
      ...(method === 'google' && { googleId: authData.googleId }),
      ...(method === 'facebook' && { facebookId: authData.facebookId }),
    }
  };
};

// Helper to handle social login success and integrate with your booking flow
export const handleSocialLoginSuccess = (authResult, setCookie, dispatch, onLoginSuccess) => {
  if (authResult.success) {
    // Store session
    const sessionStored = storeUserSession(authResult.userData, authResult.userData.data.authMethod, setCookie, dispatch);
    
    if (sessionStored) {
      toast.success(authResult.message);
      
      // Call the onLoginSuccess callback with the expected format
      onLoginSuccess({
        method: authResult.userData.data.authMethod,
        userData: authResult.userData,
        [authResult.userData.data.authMethod === 'google' ? 'googleId' : 'facebookId']: 
          authResult.userData.data[authResult.userData.data.authMethod + 'Id']
      });
    } else {
      toast.error('Failed to save login session');
    }
  } else {
    toast.error(authResult.error || 'Authentication failed');
  }
};

// Enhanced error handling for social logins
export const handleSocialLoginError = (error, method) => {
  console.error(`${method} login error:`, error);
  
  let userFriendlyMessage = 'Authentication failed. Please try again.';
  
  if (error.error) {
    if (error.error.includes('popup_blocked')) {
      userFriendlyMessage = 'Popup was blocked. Please allow popups and try again.';
    } else if (error.error.includes('cancelled')) {
      userFriendlyMessage = 'Authentication was cancelled.';
    } else if (error.error.includes('network')) {
      userFriendlyMessage = 'Network error. Please check your connection and try again.';
    }
  }
  
  toast.error(userFriendlyMessage);
};

// Environment validation helper
export const validateSocialAuthEnvironment = () => {
  const warnings = [];
  
  if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
    warnings.push('Google Client ID not found in environment variables');
  }
  
  if (!process.env.REACT_APP_FACEBOOK_APP_ID) {
    warnings.push('Facebook App ID not found in environment variables');
  }
  
  if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('Social Auth Configuration Warnings:', warnings);
  }
  
  return warnings.length === 0;
};