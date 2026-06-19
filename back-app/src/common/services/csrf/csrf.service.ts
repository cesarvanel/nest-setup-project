import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { CsrfTokenGenerator, GenerateCsrfTokenOptions } from 'csrf-csrf';

@Injectable()
export class CsrfService {
  private generator: CsrfTokenGenerator;

  init(generator: CsrfTokenGenerator): void {
    this.generator = generator;
  }

  generateToken(req: Request, res: Response, options?: GenerateCsrfTokenOptions): string {
    return this.generator(req, res, options);
  }
}
