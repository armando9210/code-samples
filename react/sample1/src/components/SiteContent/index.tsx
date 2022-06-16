import styled from 'styled-components';

type SiteContentProps = {
  flexGrow?: boolean;
  transparent?: boolean;
};

const SiteContent = styled.div<SiteContentProps>`
  display: flex;
  flex-direction: column;
  flex: ${ p => p.flexGrow ? 1 : 0 };
  padding: 14px;
  text-align: left;
  background: ${ p => p.transparent ? 'rgba(255,255,255,0)' : '#fff' };
  border-radius: 4px;
`;

export default SiteContent;
