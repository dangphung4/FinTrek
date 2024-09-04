import React from 'react';
import { Flex, Heading, Spacer, Button } from '@chakra-ui/react';

function PageHeader({ title, buttonText, onButtonClick }) {
  return (
    <Flex mb={8} align="center">
      <Heading size="lg">{title}</Heading>
      <Spacer />
      {buttonText && (
        <Button colorScheme="blue" onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </Flex>
  );
}

export default PageHeader;