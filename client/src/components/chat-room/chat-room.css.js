import { css } from 'lit';

export default css`
  :host {
    display: block;
    font-family: inherit;
    min-height: 100px;
    padding: 40px;
    width: 100%;
  }

  .room-header,
  .room-footer {
    background-color: #e8e2e2;
    border-bottom: 1px solid darkblue;
    color: darkblue;
    display: flex;
    font-weight: 700;
    justify-content: space-between;
    padding: 15px;
  }

  .room-header {
    flex-direction: column;
  }

  .room-footer {
    border-bottom: none;
    border-top: 1px solid darkblue;
  }

  .room-container {
    background-color: #fff;
    display: flex;
    gap: 20px;
    height: 250px;
    
    padding: 15px;
  }
  
  .room-users {
    border-right: 1px solid darkblue;
    overflow-y: scroll;
    overflow-x: hidden;
    padding-right: 10px;
    width: 100px;
  }
  .room-users > div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
  
  .room-messages {
    overflow-y: scroll;
    width: 100%;
  }

  .scroller {
    height: 100%;
    overflow-x: hidden;
  }
  label {
    width: 100%;
  }

  .text {
    height: 100%;
  }

  #name,
  #text {
    background-color: #e8e2e2;
    border: none;
    font-size: inherit;
    font-weight: inherit;
    outline: none;
    width: 80%;
  }

  #name:focus,
  #text:focus {
    border-bottom: 1px solid darkblue;
    outline: none;
  }

  #text {
    border-bottom: 1px solid darkblue;
  }

  button {
    background: rgb(0, 93, 232);
    border-radius: 120px;
    border: none;
    box-shadow: rgb(0 71 255 / 7%) 0px 60px 80px, rgb(0 71 255 / 5%) 0px 30.1471px 24.1177px, rgb(0 71 255 / 4%) 0px 12.5216px 10.0172px, rgb(0 71 255 / 2%) 0px 4.5288px 3.62304px;
    color: rgb(255, 255, 255);
    display: inline-block;
    font-size: 14px;
    line-height: 34px;
    min-height: 34px;
    padding: 0px 30px;
    transition: all .3s;
    width: auto;
  }
  button:hover {
    background: #1f283d;
    color: #fff;
  }

 .scroll-to-view {
    scroll-into-view: behaviour-smooth block-center;
  }
`
