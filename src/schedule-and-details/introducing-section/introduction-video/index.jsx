import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Card } from '@openedx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './messages';
import { isValidVideoId, normalizeVideoInput } from './youtubeId';

const IntroductionVideo = ({
  intl, introVideo, errorFeedback, onChange,
}) => {
  // Preview only a valid ID, so a half-typed or rejected value never loads a broken embed.
  const embedVideoUrl = introVideo && isValidVideoId(introVideo)
    ? `//www.youtube.com/embed/${introVideo}`
    : '';

  return (
    <Form.Group className="form-group-custom">
      <Form.Label>
        {intl.formatMessage(messages.courseIntroductionVideoLabel)}
      </Form.Label>
      <Card>
        <Card.Body className="embed-video-container">
          <div className="introduction-video">
            <iframe
              title={intl.formatMessage(messages.courseIntroductionVideoLabel)}
              width="618"
              height="350"
              src={embedVideoUrl}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </Card.Body>
        <Card.Divider />
        <Card.Footer className="p-2.5">
          <Form.Control
            value={introVideo || ''}
            placeholder={intl.formatMessage(messages.courseIntroductionVideoPlaceholder)}
            isInvalid={!!errorFeedback}
            // A pasted link is reduced to its video ID right here.
            onChange={(e) => onChange(normalizeVideoInput(e.target.value), 'introVideo')}
          />
          <Button
            variant="outline-primary"
            onClick={() => onChange('', 'introVideo')}
            disabled={!introVideo}
          >
            {intl.formatMessage(messages.courseIntroductionVideoDelete)}
          </Button>
        </Card.Footer>
      </Card>
      {errorFeedback ? (
        <Form.Control.Feedback type="invalid" hasIcon={false}>
          {errorFeedback}
        </Form.Control.Feedback>
      ) : null}
      <Form.Control.Feedback>
        {intl.formatMessage(messages.courseIntroductionVideoHelpText)}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

IntroductionVideo.defaultProps = {
  introVideo: '',
  errorFeedback: '',
};

IntroductionVideo.propTypes = {
  intl: intlShape.isRequired,
  introVideo: PropTypes.string,
  errorFeedback: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default injectIntl(IntroductionVideo);
