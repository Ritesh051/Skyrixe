// Fixed SocialAuthUtil.js
import { userDetailState } from "../reduxToolkit/Slices/ProductList/listApis";
import { toast } from "react-toastify";

// Your actual Google Client ID
const GOOGLE_CLIENT_ID = "100748839589-chdc48opcq06i8kkijr3a9lbrfbq8vkd.apps.googleusercontent.com";

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
      // Initialize Google OAuth with the correct client ID
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
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
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID, // Use the actual client ID here
            callback: (credentialResponse) => {
              try {
                console.log('Google credential response:', credentialResponse);
                
                // Decode JWT token to get user info
                const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
                console.log('Decoded payload:', payload);
                
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

          // Use Google One Tap prompt
          window.google.accounts.id.prompt((notification) => {
            console.log('Google prompt notification:', notification);
            
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              console.log('One Tap not displayed, falling back to popup');
              
              // Fallback: Use popup instead of hidden button click
              window.google.accounts.id.disableAutoSelect();
              
              // Create a temporary div for the Google sign-in button
              const tempDiv = document.createElement('div');
              tempDiv.id = 'temp-google-signin';
              tempDiv.style.position = 'absolute';
              tempDiv.style.left = '-9999px';
              tempDiv.style.visibility = 'hidden';
              document.body.appendChild(tempDiv);

              // Render button
              window.google.accounts.id.renderButton(tempDiv, {
                theme: 'outline',
                size: 'large',
                type: 'standard',
                text: 'signin_with',
                shape: 'rectangular',
                logo_alignment: 'left',
                width: 250,
              });

              // Auto-click the button after a short delay
              setTimeout(() => {
                const button = tempDiv.querySelector('[role="button"]');
                if (button) {
                  button.click();
                } else {
                  console.error('Google sign-in button not found');
                  // Clean up
                  if (document.getElementById('temp-google-signin')) {
                    document.body.removeChild(tempDiv);
                  }
                  reject({
                    success: false,
                    error: 'Google sign-in button not rendered properly'
                  });
                }

                // Clean up the temporary div after a delay
                setTimeout(() => {
                  if (document.getElementById('temp-google-signin')) {
                    document.body.removeChild(tempDiv);
                  }
                }, 1000);
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

// Alternative Google Login using popup (more reliable)
export const handleGoogleLoginPopup = () => {
  return new Promise((resolve, reject) => {
    try {
      initializeGoogleAuth()
        .then(() => {
          // Create and show a visible button for user to click
          const loginDiv = document.createElement('div');
          loginDiv.id = 'google-signin-button';
          loginDiv.style.position = 'fixed';
          loginDiv.style.top = '50%';
          loginDiv.style.left = '50%';
          loginDiv.style.transform = 'translate(-50%, -50%)';
          loginDiv.style.zIndex = '9999';
          loginDiv.style.background = 'white';
          loginDiv.style.padding = '20px';
          loginDiv.style.border = '2px solid #ccc';
          loginDiv.style.borderRadius = '8px';
          loginDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          
          // Add close button
          const closeBtn = document.createElement('button');
          closeBtn.innerHTML = '×';
          closeBtn.style.position = 'absolute';
          closeBtn.style.top = '5px';
          closeBtn.style.right = '10px';
          closeBtn.style.border = 'none';
          closeBtn.style.background = 'none';
          closeBtn.style.fontSize = '20px';
          closeBtn.style.cursor = 'pointer';
          closeBtn.onclick = () => {
            document.body.removeChild(loginDiv);
            reject({
              success: false,
              error: 'Google login cancelled by user'
            });
          };
          
          loginDiv.appendChild(closeBtn);
          
          // Add title
          const title = document.createElement('div');
          title.innerHTML = 'Click to sign in with Google';
          title.style.marginBottom = '15px';
          title.style.textAlign = 'center';
          title.style.fontWeight = 'bold';
          loginDiv.appendChild(title);
          
          document.body.appendChild(loginDiv);

          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (credentialResponse) => {
              try {
                // Clean up the popup
                if (document.getElementById('google-signin-button')) {
                  document.body.removeChild(loginDiv);
                }
                
                console.log('Google credential response:', credentialResponse);
                
                // Decode JWT token to get user info
                const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
                console.log('Decoded payload:', payload);
                
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

          // Render the actual Google button in the popup
          window.google.accounts.id.renderButton(loginDiv, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: 300,
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

// Facebook OAuth Integration (unchanged)
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

// Rest of your utility functions remain the same...
export const handleEmailPasswordLogin = async (email, password) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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

    const userData = {
      _id: `email_${Date.now()}`,
      userId: `email_${Date.now()}`,
      data: {
        personalInfo: {
          name: "Email User",
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
  } catch (error) {
    console.error('Email login error:', error);
    return {
      success: false,
      error: 'Network error. Please try again.'
    };
  }
};

export const storeUserSession = (userData, loginMethod, setCookie, dispatch) => {
  try {
    window.localStorage.setItem("LennyUserDetail", JSON.stringify(userData));
    window.localStorage.setItem("LoginTimer", "false");
    
    setCookie("LennyCheck", true, { path: "/" }, { expires: new Date("9999-12-31") });
    
    if (loginMethod === 'mobile' && userData.data?.personalInfo?.phone) {
      setCookie("LennyPhone_number", userData.data.personalInfo.phone, { path: "/" }, { expires: new Date("9999-12-31") });
    }

    dispatch(userDetailState(true));
    return true;
  } catch (error) {
    console.error('Error storing user session:', error);
    return false;
  }
};

export const clearUserSession = (setCookie, dispatch) => {
  try {
    window.localStorage.removeItem("LennyUserDetail");
    window.localStorage.setItem("LoginTimer", "true");
    
    setCookie("LennyCheck", false, { path: "/" });
    setCookie("LennyPhone_number", "", { path: "/" });

    dispatch(userDetailState(false));
    return true;
  } catch (error) {
    console.error('Error clearing user session:', error);
    return false;
  }
};

export const validateMobileNumber = (mobile) => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

export const formatOtpTimer = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

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

export const handleSocialLoginSuccess = (authResult, setCookie, dispatch, onLoginSuccess) => {
  if (authResult.success) {
    const sessionStored = storeUserSession(authResult.userData, authResult.userData.data.authMethod, setCookie, dispatch);
    
    if (sessionStored) {
      toast.success(authResult.message);
      
      onLoginSuccess({
        method: authResult.userData.data.authMethod,
        userData: authResult.userData,
        user: authResult.userData,
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

export const validateSocialAuthEnvironment = () => {
  const warnings = [];
  
  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('your-google')) {
    warnings.push('Google Client ID not properly configured');
  }
  
  if (!process.env.REACT_APP_FACEBOOK_APP_ID) {
    warnings.push('Facebook App ID not found in environment variables');
  }
  
  if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('Social Auth Configuration Warnings:', warnings);
  }
  
  return warnings.length === 0;
};