import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, notification } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { tokens } from '../utils/tokens';
import { TokenIcon } from '@token-icons/react';
import { Link, useLocation } from 'react-router-dom';

const Home = () => {
  const [firstToken, setFirstToken] = useState(
    tokens.find(k => k.symbol === 'ETH')
  );
  const [secondToken, setSecondToken] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentToken, setCurrentToken] = useState(0);
  const [val1, setVal1] = useState(0);
  const [val2, setVal2] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    let token1 = searchParams.get('token1');
    let token2 = searchParams.get('token2');
    if (token1) setFirstToken(tokens.find(k => k.symbol === token1));
    if (token2) setSecondToken(tokens.find(k => k.symbol === token2));
  }, [location]);

  const switchTokens = () => {
    setFirstToken(secondToken);
    setSecondToken(firstToken);
    setVal1(val2);
    setVal2(val1);
  };

  const showNotification = (message, type = 'info') => {
    notification[type]({
      message: message,
      duration: 3
    });
  };

  const openTokenSelectModal = () => {
    setModalVisible(true);
  };

  return (
    <>
      <div className="flex h-screen items-center justify-center bg-gray-800 p-4">
        <div className="w-full max-w-md rounded-lg bg-gray-900 p-6 text-white">
          <div className="mb-4">
            <label
              htmlFor="pay"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              You receive with
              <span className="mx-3"> {firstToken?.name} ({firstToken?.price}$/1{firstToken.symbol})</span>
            </label>
            <Input
              size="large"
              placeholder="0"
              value={val1}
              onChange={e => {
                setVal1(e.target.value);
                setVal2(
                  (e.target.value * firstToken?.price) / secondToken?.price
                );
              }}
              suffix={
                <Button
                  type="dashed"
                  onClick={() => {
                    setCurrentToken(0);
                    openTokenSelectModal();
                  }}
                  className="flex"
                >
                  <TokenIcon
                    symbol={firstToken?.symbol}
                    size={24}
                    variant="branded"
                    className="inline"
                  />
                  {firstToken?.symbol || 'Select Token'}
                </Button>
              }
            />
          </div>
          <div className="flex justify-center">
            <Button onClick={switchTokens}>Switch</Button>
          </div>

          <div className="mb-4">
            <label
              htmlFor="receive"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              You receive with
              <span className="mx-3"> {secondToken?.name} ({secondToken?.price}$/1{secondToken.symbol})</span>
            </label>
            <Input
              size="large"
              placeholder="0"
              value={val2}
              onChange={e => {
                setVal2(e.target.value);
                setVal1(
                  (e.target.value * secondToken?.price) / firstToken?.price
                );
              }}
              suffix={
                <Button
                  type="dashed"
                  onClick={() => {
                    setCurrentToken(1);
                    openTokenSelectModal();
                  }}
                >
                  <TokenIcon
                    symbol={secondToken?.symbol}
                    size={24}
                    variant="branded"
                    className="inline"
                  />
                  {secondToken?.symbol || 'Select Token'}
                </Button>
              }
            />
          </div>
          <Button
            type="primary"
            block
            onClick={() => showNotification('Swap Success!', 'success')}
          >
            Swap
          </Button>
        </div>
      </div>
      <Modal
        title="Select a token"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        className="w-48"
      >
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Search name or paste address"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="max-h-64 overflow-auto">
            {tokens
              .filter(token => {
                return (
                  token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
                );
              })
              .map(token => (
                <Link
                  key={token.symbol}
                  className="flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-gray-200"
                  to={`?token1=${
                    currentToken ? firstToken?.symbol : token.symbol
                  }&token2=${
                    currentToken ? token.symbol : secondToken?.symbol
                  }`}
                  onClick={() => {
                    setVal2((val1 * token.price) / firstToken.price);
                    setModalVisible(false);
                  }}
                >
                  <div className="flex w-full justify-between">
                    <div className="flex items-center gap-2">
                      <TokenIcon
                        symbol={token.symbol}
                        size={48}
                        variant="branded"
                        className="inline"
                      />
                      <div className="flex flex-col">
                        <span>{token.name}</span>
                        <span>{token.symbol}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-lg">
                      {token.price}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Home;
