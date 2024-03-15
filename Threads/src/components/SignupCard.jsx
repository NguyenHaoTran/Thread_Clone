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
  
  export default function SignupCard() {
    const [showPassword, setShowPassword] = useState(false)

    const setAuthScreen = useSetRecoilState(authScreenAtom);
    const [inputs, setInputs] = useState({
      name: "",
      username: "",
      email: "",
      password: "",
    });

    const handleSignup = async () => {
      console.log(inputs)
      try {
        const res = await fetch("/api/users/signup",{
          method: "POST",
          headers: {
            "Content-Type":"application/json",
          },
          body: JSON.stringify(inputs)
        })
        const data = await res.json();

        if(data.error){

        }

      } catch (err) {
        console.log(err);
      }
    }
  
    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue( 'gray.dark')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Đăng ký
            </Heading>
            
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.dark')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl id="firstName" isRequired>
                    <FormLabel>Full name</FormLabel>
                    <Input type="text" 
                      onChange={(e) => setInputs({...inputs, name: e.target.value})}
                      value={inputs.name}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName">
                    <FormLabel>Username</FormLabel>
                    <Input type="text" 
                      onChange={(e) => setInputs({...inputs, username: e.target.value})}
                      value={inputs.username}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type="email" 
                  onChange={(e) => setInputs({...inputs, email: e.target.value})}
                  value={inputs.email}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? 'text' : 'password'} 
                    onChange={(e) => setInputs({...inputs, password: e.target.value})}
                    value={inputs.password}
                  />
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
                  }}
                  onClick={handleSignup}  
                  >
                  Đăng ký
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Bạn đã có tài khoản? <Link color={'blue.400'}
                  onClick={() => setAuthScreen("login")}
                  >Đăng nhập</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    )
  }

  //3:48:01 