/**
 * Sends a Canvas course invitation
 * @param {string} userEmail - The email address of the user to invite
 */
export async function sendCourseInvitationOnLogin(userEmail) {
  try {
    const courseId = process.env.CANVAS_COURSE_ID;
    if (!courseId) {
      throw new Error("CANVAS_COURSE_ID is not defined");
    }
    
    console.log(`Processing enrollment for ${userEmail} in course ${courseId}`);
    
    // Step 1: First find the user by email
    const userSearchUrl = `https://canvas.txstate.edu/api/v1/accounts/self/users?search_term=${encodeURIComponent(userEmail)}`;
    const searchResponse = await fetch(userSearchUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.CANVAS_API_TOKEN}`
      }
    });
    
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      throw new Error(`Canvas API search error: ${searchResponse.status} - ${errorText}`);
    }
    
    const users = await searchResponse.json();
    console.log(`Search results:`, users);
    
    // Check if user exists
    if (!Array.isArray(users) || users.length === 0) {
      throw new Error(`User with email ${userEmail} not found in Canvas. They must have a Canvas account first.`);
    }
    
    const userId = users[0].id;
    
    // Step 2: Now enroll the user using form data as shown in the documentation
    const formData = new FormData();
    formData.append('enrollment[user_id]', userId);
    formData.append('enrollment[type]', 'StudentEnrollment');
    formData.append('enrollment[enrollment_state]', 'active');
    formData.append('enrollment[notify]', 'true');
    
    const enrollmentUrl = `https://canvas.txstate.edu/api/v1/courses/${courseId}/enrollments`;
    
    const enrollResponse = await fetch(enrollmentUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CANVAS_API_TOKEN}`
        // Let fetch set the appropriate Content-Type for FormData
      },
      body: formData
    });
    
    if (!enrollResponse.ok) {
      const errorText = await enrollResponse.text();
      throw new Error(`Canvas API enrollment error: ${enrollResponse.status} - ${errorText}`);
    }
    
    const result = await enrollResponse.json();
    console.log("Enrollment successful:", result);
    return result;
  } catch (error) {
    console.error("Failed to send course invitation:", error);
    throw error;
  }
}
