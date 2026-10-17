import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  courseIntroductionVideoLabel: {
    id: 'course-authoring.schedule-section.introducing.introduction-video.label',
    defaultMessage: 'Course introduction video',
  },
  courseIntroductionVideoDelete: {
    id: 'course-authoring.schedule-section.introducing.introduction-video.delete',
    defaultMessage: 'Delete current video',
  },
  courseIntroductionVideoHelpText: {
    id: 'course-authoring.schedule-section.introducing.introduction-video.help-text',
    defaultMessage: 'Paste a YouTube link or video ID. A start time in the link is not supported and is dropped.',
  },
  courseIntroductionVideoPlaceholder: {
    id: 'course-authoring.schedule-section.introducing.introduction-video.placeholder',
    defaultMessage: 'Paste a YouTube link or video ID',
  },
});

export default messages;
