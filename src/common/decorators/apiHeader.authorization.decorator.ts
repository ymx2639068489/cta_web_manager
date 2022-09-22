import { ApiHeader } from '@nestjs/swagger';
export const ApiHeaderAuth = () => ApiHeader({
  name: 'authorization',
  description: '携带token: "Bearer " + Token',
  required: true,
})