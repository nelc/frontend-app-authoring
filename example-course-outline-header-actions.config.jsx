import React, { useState, useEffect } from 'react';
import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';
import { Button } from '@openedx/paragon';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient, getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { useCourseAuthoringContext } from './src/CourseAuthoringContext';

/**
 * Example: Add a custom button to the Course Outline Header Actions
 * *
 * To use this example:
 * 1. Copy this file to env.config.jsx (which is gitignored)
 * 2. Customize the MyButton component to add your desired functionality
 * 3. Restart your dev server to see the changes
 */

const MyButton = () => {
  const { courseId } = useCourseAuthoringContext();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setLoading(true);
        const studioBaseUrl = getConfig().STUDIO_BASE_URL;
        const { data } = await getAuthenticatedHttpClient()
          .get(`${studioBaseUrl}/api/contentstore/v1/course_team/${courseId}`);
        
        const camelCaseData = camelCaseObject(data);
        const currentUser = getAuthenticatedUser();
        const currentUserEmail = currentUser?.email;

        const currentUserInTeam = camelCaseData?.users?.find(
          (user) => user.email === currentUserEmail,
        );

        setUserRole(currentUserInTeam?.role || 'No role');
      } catch (error) {
        setUserRole('Error');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchUserRole();
    }
  }, [courseId]);
  
  return (
    <Button>
      🐣 Role: {loading ? 'Loading...' : userRole}
    </Button>
  );
};

// Load environment variables from .env file
const config = {
  ...process.env,
  pluginSlots: {
    // Example: Add a custom button to the Course Outline Header Actions
    'org.openedx.frontend.authoring.course_outline_header_actions.v1': {
      keepDefault: true, // Keep the default buttons
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'my-extra-button',
            priority: 60, // Controls the position of the button (higher = more to the right)
            type: DIRECT_PLUGIN,
            RenderWidget: MyButton,
          },
        },
      ],
    },
  },
};

export default config;
