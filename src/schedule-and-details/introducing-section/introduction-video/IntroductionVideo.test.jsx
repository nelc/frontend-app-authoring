import React, { useState } from 'react';
import { act, render, fireEvent } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import { courseDetailsMock } from '../../__mocks__';
import messages from './messages';
import IntroductionVideo from '.';

describe('<IntroductionVideo />', () => {
  const onChangeMock = jest.fn();
  const RootWrapper = (props) => (
    <IntlProvider locale="en">
      <IntroductionVideo {...props} />
    </IntlProvider>
  );

  const props = {
    intl: {},
    introVideo: courseDetailsMock.introVideo,
    onChange: onChangeMock,
  };

  it('renders successfully', () => {
    const {
      getByText, getByPlaceholderText, getByRole, getByTitle,
    } = render(
      <RootWrapper {...props} />,
    );
    expect(
      getByText(messages.courseIntroductionVideoLabel.defaultMessage),
    ).toBeInTheDocument();
    expect(
      getByText(messages.courseIntroductionVideoHelpText.defaultMessage),
    ).toBeInTheDocument();
    expect(
      getByPlaceholderText(messages.courseIntroductionVideoPlaceholder.defaultMessage),
    ).toBeInTheDocument();
    expect(
      getByRole('button', { name: messages.courseIntroductionVideoDelete.defaultMessage }),
    ).toBeInTheDocument();
    expect(getByTitle(messages.courseIntroductionVideoLabel.defaultMessage)).toBeInTheDocument();
  });

  it('should call onChange if video input id changed', async () => {
    const { getByPlaceholderText } = render(<RootWrapper {...props} />);
    const input = getByPlaceholderText(
      messages.courseIntroductionVideoPlaceholder.defaultMessage,
    );
    act(() => {
      fireEvent.change(input, { target: { value: '/assets' } });
    });
    expect(onChangeMock).toHaveBeenCalledWith(
      '/assets',
      'introVideo',
    );
  });

  it('should clear video input if button delete clicked', () => {
    const initialProps = { ...props, introVideo: 'BvgNgTPTkSo' };
    const { getByRole } = render(<RootWrapper {...initialProps} />);
    const button = getByRole('button', { name: messages.courseIntroductionVideoDelete.defaultMessage });
    fireEvent.click(button);
    expect(onChangeMock).toHaveBeenCalledWith('', 'introVideo');
  });

  describe('pasting a link', () => {
    // Mirrors the page: the parent owns the value and passes it back down.
    // eslint-disable-next-line react/prop-types
    const Controlled = ({ errorFeedback }) => {
      const [value, setValue] = useState('');
      return (
        <IntlProvider locale="en">
          <IntroductionVideo introVideo={value} errorFeedback={errorFeedback} onChange={setValue} />
        </IntlProvider>
      );
    };
    const placeholder = messages.courseIntroductionVideoPlaceholder.defaultMessage;

    it('shows the ID in the field and previews the matching embed', () => {
      const { getByPlaceholderText, getByTitle } = render(<Controlled />);
      fireEvent.change(getByPlaceholderText(placeholder), {
        target: { value: ' https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s ' },
      });
      expect(getByPlaceholderText(placeholder)).toHaveValue('dQw4w9WgXcQ');
      expect(getByTitle(messages.courseIntroductionVideoLabel.defaultMessage))
        .toHaveAttribute('src', '//www.youtube.com/embed/dQw4w9WgXcQ');
    });

    it('does not embed an invalid value and shows the error', () => {
      const { getByPlaceholderText, getByTitle, getByText } = render(<Controlled errorFeedback="bad video" />);
      fireEvent.change(getByPlaceholderText(placeholder), { target: { value: 'junk' } });
      expect(getByPlaceholderText(placeholder)).toHaveValue('junk');
      expect(getByTitle(messages.courseIntroductionVideoLabel.defaultMessage)).toHaveAttribute('src', '');
      expect(getByText('bad video')).toBeInTheDocument();
    });
  });
});
