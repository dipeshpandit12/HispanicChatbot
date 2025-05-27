/**
 * Canvas Course Enrollment Service
 * Handles enrolling users into Canvas courses after they sign up
 */

/**
 * Sends a Canvas course invitation and enrolls user
 * @param {string} userEmail - The email address of the user to invite
 * @param {string} courseId - Optional course ID, defaults to env variable
 * @returns {Promise<Object>} - Enrollment result with detailed status
 */
export async function sendCourseInvitationOnLogin(userEmail, courseId = null) {
  try {
    // Use provided courseId or fall back to environment variable
    const targetCourseId = courseId || process.env.CANVAS_COURSE_ID;
    const canvasBaseUrl = process.env.CANVAS_BASE_URL || 'https://canvas.txstate.edu';

    // Validate required configuration
    if (!targetCourseId) {
      throw new Error("Course ID is required (CANVAS_COURSE_ID environment variable or parameter)");
    }

    if (!process.env.CANVAS_API_TOKEN) {
      throw new Error("CANVAS_API_TOKEN environment variable is required");
    }

    console.log(`Processing enrollment for ${userEmail} in course ${targetCourseId}`);

    // Step 1: Search for user by email
    const userSearchResult = await findCanvasUserByEmail(userEmail, canvasBaseUrl);
    if (!userSearchResult.success) {
      return userSearchResult;
    }

    const { user: canvasUser } = userSearchResult;

    // Step 2: Check if user is already enrolled
    const enrollmentCheckResult = await checkExistingEnrollment(canvasUser.id, targetCourseId, canvasBaseUrl);
    if (enrollmentCheckResult.already_enrolled) {
      return {
        success: true,
        already_enrolled: true,
        message: `User ${userEmail} is already enrolled in course ${targetCourseId}`,
        enrollment: enrollmentCheckResult.enrollment,
        user: canvasUser
      };
    }

    // Step 3: Enroll the user
    const enrollmentResult = await enrollUserInCourse(canvasUser.id, targetCourseId, canvasBaseUrl);

    if (enrollmentResult.success) {
      return {
        success: true,
        message: `Successfully enrolled ${userEmail} in Canvas course ${targetCourseId}`,
        enrollment: enrollmentResult.enrollment,
        user: canvasUser,
        course_id: targetCourseId
      };
    } else {
      return enrollmentResult;
    }

  } catch (error) {
    console.error("Canvas enrollment service error:", error);
    return {
      success: false,
      error: 'SYSTEM_ERROR',
      message: error.message,
      action_required: 'Check Canvas API configuration and network connectivity'
    };
  }
}

/**
 * Find a Canvas user by email address
 * @param {string} email - User email to search for
 * @param {string} baseUrl - Canvas base URL
 * @returns {Promise<Object>} - Search result
 */
async function findCanvasUserByEmail(email, baseUrl) {
  try {
    const userSearchUrl = `${baseUrl}/api/v1/accounts/self/users?search_term=${encodeURIComponent(email)}&include[]=email`;

    const searchResponse = await fetch(userSearchUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.CANVAS_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error(`Canvas user search failed: ${searchResponse.status} - ${errorText}`);
      
      return {
        success: false,
        error: 'USER_SEARCH_FAILED',
        message: `Failed to search for user in Canvas: ${searchResponse.status}`,
        details: errorText
      };
    }

    const users = await searchResponse.json();
    console.log(`Found ${users?.length || 0} users matching "${email}"`);

    if (!Array.isArray(users) || users.length === 0) {
      return {
        success: false,
        error: 'USER_NOT_FOUND',
        message: `User with email ${email} not found in Canvas. They must create a Canvas account first.`,
        action_required: 'User needs to register for Canvas account',
        canvas_signup_url: `${baseUrl}/register`
      };
    }

    // Find exact email match (Canvas search can return partial matches)
    const exactUser = users.find(user => {
      const userEmails = [
        user.email, 
        user.login_id,
        ...(user.communication_channels || []).map(ch => ch.address)
      ].filter(Boolean);
      
      return userEmails.some(userEmail => 
        userEmail?.toLowerCase().trim() === email.toLowerCase().trim()
      );
    });

    const targetUser = exactUser || users[0];

    return {
      success: true,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email || targetUser.login_id,
        canvas_id: targetUser.id
      }
    };

  } catch (error) {
    return {
      success: false,
      error: 'SEARCH_ERROR',
      message: `Error searching for Canvas user: ${error.message}`
    };
  }
}

/**
 * Check if user is already enrolled in the course
 * @param {number} userId - Canvas user ID
 * @param {string} courseId - Canvas course ID
 * @param {string} baseUrl - Canvas base URL
 * @returns {Promise<Object>} - Enrollment check result
 */
async function checkExistingEnrollment(userId, courseId, baseUrl) {
  try {
    const existingEnrollmentUrl = `${baseUrl}/api/v1/courses/${courseId}/enrollments?user_id=${userId}`;
    
    const response = await fetch(existingEnrollmentUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.CANVAS_API_TOKEN}`
      }
    });

    if (!response.ok) {
      console.warn(`Could not check existing enrollments: ${response.status}`);
      return { already_enrolled: false };
    }

    const enrollments = await response.json();
    const activeStudentEnrollment = enrollments.find(enrollment => 
      enrollment.enrollment_state === 'active' && 
      enrollment.type === 'StudentEnrollment'
    );

    return {
      already_enrolled: !!activeStudentEnrollment,
      enrollment: activeStudentEnrollment || null
    };

  } catch (error) {
    console.warn(`Error checking existing enrollment: ${error.message}`);
    return { already_enrolled: false };
  }
}

/**
 * Enroll user in Canvas course
 * @param {number} userId - Canvas user ID
 * @param {string} courseId - Canvas course ID
 * @param {string} baseUrl - Canvas base URL
 * @returns {Promise<Object>} - Enrollment result
 */
async function enrollUserInCourse(userId, courseId, baseUrl) {
  try {
    const formData = new FormData();
    formData.append('enrollment[user_id]', userId.toString());
    formData.append('enrollment[type]', 'StudentEnrollment');
    formData.append('enrollment[enrollment_state]', 'active');
    formData.append('enrollment[notify]', 'true');
    formData.append('enrollment[self_enrolled]', 'false');

    const enrollmentUrl = `${baseUrl}/api/v1/courses/${courseId}/enrollments`;

    const enrollResponse = await fetch(enrollmentUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CANVAS_API_TOKEN}`
      },
      body: formData
    });

    if (!enrollResponse.ok) {
      const errorText = await enrollResponse.text();
      console.error(`Canvas enrollment failed: ${enrollResponse.status} - ${errorText}`);
      
      // Handle specific Canvas API error responses
      const errorDetails = await parseCanvasError(enrollResponse.status, errorText);
      return {
        success: false,
        ...errorDetails
      };
    }

    const enrollment = await enrollResponse.json();
    console.log("Canvas enrollment successful:", enrollment);
    
    return {
      success: true,
      enrollment: enrollment
    };

  } catch (error) {
    return {
      success: false,
      error: 'ENROLLMENT_ERROR',
      message: `Failed to enroll user in course: ${error.message}`
    };
  }
}

/**
 * Parse Canvas API errors into user-friendly messages
 * @param {number} status - HTTP status code
 * @param {string} errorText - Error response text
 * @returns {Object} - Parsed error information
 */
async function parseCanvasError(status, errorText) {
  const baseError = {
    details: errorText,
    status: status
  };

  switch (status) {
    case 400:
      return {
        ...baseError,
        error: 'INVALID_REQUEST',
        message: 'Invalid enrollment request. User may already be enrolled or parameters are incorrect.',
        action_required: 'Verify course ID and user information'
      };
    
    case 401:
      return {
        ...baseError,
        error: 'UNAUTHORIZED',
        message: 'Canvas API token is invalid or expired',
        action_required: 'Update Canvas API token'
      };
    
    case 403:
      return {
        ...baseError,
        error: 'FORBIDDEN',
        message: 'Insufficient permissions to enroll users in this course',
        action_required: 'Check Canvas API token permissions'
      };
    
    case 404:
      return {
        ...baseError,
        error: 'COURSE_NOT_FOUND',
        message: 'Course not found or not accessible with current permissions',
        action_required: 'Verify course ID and API token permissions'
      };
    
    case 422:
      return {
        ...baseError,
        error: 'UNPROCESSABLE_ENTITY',
        message: 'Enrollment data is invalid or enrollment rules violated',
        action_required: 'Check enrollment requirements and user eligibility'
      };
    
    case 429:
      return {
        ...baseError,
        error: 'RATE_LIMITED',
        message: 'Canvas API rate limit exceeded',
        action_required: 'Retry after delay or reduce request frequency'
      };
    
    default:
      return {
        ...baseError,
        error: 'API_ERROR',
        message: `Canvas API error: ${status}`,
        action_required: 'Check Canvas API status and configuration'
      };
  }
}

/**
 * Batch enroll multiple users (useful for bulk operations)
 * @param {Array<string>} emails - Array of user emails
 * @param {string} courseId - Canvas course ID
 * @returns {Promise<Object>} - Batch enrollment results
 */
export async function batchEnrollUsers(emails, courseId = null) {
  const results = {
    successful: [],
    failed: [],
    already_enrolled: [],
    not_found: []
  };

  console.log(`Starting batch enrollment for ${emails.length} users`);

  for (const email of emails) {
    try {
      // Add small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = await sendCourseInvitationOnLogin(email, courseId);
      
      if (result.success) {
        if (result.already_enrolled) {
          results.already_enrolled.push({ email, ...result });
        } else {
          results.successful.push({ email, ...result });
        }
      } else {
        if (result.error === 'USER_NOT_FOUND') {
          results.not_found.push({ email, ...result });
        } else {
          results.failed.push({ email, ...result });
        }
      }
    } catch (error) {
      results.failed.push({ 
        email, 
        success: false, 
        error: 'BATCH_ERROR', 
        message: error.message 
      });
    }
  }

  console.log(`Batch enrollment completed:`, {
    successful: results.successful.length,
    failed: results.failed.length,
    already_enrolled: results.already_enrolled.length,
    not_found: results.not_found.length
  });

  return results;
}

// Export utility functions for external use
export { 
  findCanvasUserByEmail, 
  checkExistingEnrollment, 
  enrollUserInCourse 
};