import React from 'react';
import styled from 'styled-components';

/**
 * Property definition for the {Heading} component
 *
 * @property title - Text to be displayed as the title
 * @property titleTag - Defines the tag that will be used to render the title, defaults to h1
 * @property top - Component to be rendered within the top-most section,
 *  which extends to the full width of the component itself
 * @property bottom - Component to be rendered within the bottom-most section,
 *  which extends to the full width of the component itself
 * @property actions - Component to be rendered within the actions section
 */
interface HeadingProps {
  title?: string | React.ReactNode;
  titleTag?: string | React.ElementType;
  top?: any;
  bottom?: any;
  actions?: any;
  children?: any;
}

interface TitleTextProps {
  as?: React.ElementType;
}

const HeadingWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const HeadingTop = styled.div`
  margin-bottom: 29px;
  width: 100%;
`;

const HeadingBottom = styled.div`
  margin-top: 25px;
  width: 100%;
`;

const HeadingContent = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const Title = styled.div<TitleTextProps>`
  font-family: Lato, sans-serif;
  font-size: 28px;
  font-weight: 900;
  color: #2d3f5d;
  margin: 0;
`;

/**
 * Defines a page heading component.
 *
 * Usually it's comprised of four parts:
 *  - Top
 *  - Title
 *  - Action buttons (same level as title)
 *  - Bottom
 *
 * You can omit both breadcrumbs/actions, but the title is required.
 */
function Heading({ title, titleTag = 'h1', actions, top, bottom, children }: HeadingProps) {
  if (!title && !children) {
    throw new Error('Heading must specify either the title or children prop');
  }

  let content;

  if (title) {
    if (typeof title === 'string') {
      content = (
        <Title as={titleTag as React.ElementType}>
          {title}
        </Title>
      );
    } else {
      content = title;
    }
  } else {
    content = children;
  }

  return (
    <HeadingWrapper>
      {top ? <HeadingTop>{top}</HeadingTop> : null}

      <HeadingContent>
        {content}
        {actions || null}
      </HeadingContent>

      {bottom ? <HeadingBottom>{bottom}</HeadingBottom> : null}
    </HeadingWrapper>
  );
}

Heading.defaultProps = {
  title: '',
  titleTag: '',
  top: undefined,
  bottom: undefined,
  actions: undefined,
  children: undefined,
};

export default Heading;
