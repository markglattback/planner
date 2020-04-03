import styled from 'styled-components';

const StyledNav = styled.nav`
    display: flex;
    justify-content: flex-end;
    height: 32px; 
`;

const StyledNavButtonWrapper = styled.div`
    width: 64px;
    height: 64px;
    margin: -16px -16px 0 0; 
    padding: 16px;
    display: flex;
    postion: relative;
    justify-content: flex-end;
    align-items: center;    
`;

const StyledNavButton = styled.div`
    width: 32px;
    background: #333;
    height: 4px;
    left: 4px;    

    :before {
        content: "";
        display: block; 
        position: relative;
        bottom: 10px;
        left: 0px; 
        height: 4px;
        width: 32px; 
        background: #333;
    }

    :after {
        content: "";
        display: block; 
        position: relative;
        top: 6px;
        left: 8px; 
        height: 4px;
        width: 24px; 
        background: #333;
    }
`;

const Nav = ({ authenticated, firstname }) => {
    return (
        <StyledNav>
            <StyledNavButtonWrapper>
                <StyledNavButton />
            </StyledNavButtonWrapper>
        </StyledNav>
    )
}

export default Nav;