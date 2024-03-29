import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
  } from '@chakra-ui/react'
  import { useState } from 'react'
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import { authScreenAtom } from '../atoms/authAtom'
  
  export default function LoginCard() {
    const [showPassword, setShowPassword] = useState(false)

    const setAuthScreen = useSetRecoilState(authScreenAtom);
  
    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue( 'gray.dark')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Đăng nhập
            </Heading>
            
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.dark')}
            boxShadow={'lg'}
            p={8}
            w={{
                base: "full",
                sm: "400px",
                
            }}>
            <Stack spacing={4}>

              <FormControl  isRequired>
                <FormLabel>Username</FormLabel>
                <Input type="text" />
              </FormControl>
              <FormControl  isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? 'text' : 'password'} />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() => setShowPassword((showPassword) => !showPassword)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg={useColorModeValue("gray.600", "gray.700")}
                  color={'white'}
                  _hover={{
                    bg: useColorModeValue("gray.700", "gray.800"),
                  }}>
                  Đăng nhập
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Bạn chưa có tài khoản? <Link color={'blue.400'}
                  onClick={() => setAuthScreen("signup")}
                  >Đăng ký ngay</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    )
  }