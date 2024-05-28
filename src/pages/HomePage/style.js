import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
    display : flex;
    align-items : center;
    gap: 24px;
    justify-content : flex-left;
    height: 44px;
`

export const WrapperButtonMore = styled(ButtonComponent)`
    &:hover{
        background-color: rgb(13, 92, 182);
        color: white;
    }
    width: 100%;
    text-align: center;
`

export const WrapperProducts = styled.div`
    display: flex;
    gap: 14px;
    margin-top: 20px;
    flex-wrap: wrap;
`