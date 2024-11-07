import { Test, TestingModule } from '@nestjs/testing';
import { TrackerController } from './tracker.controller';
import { TrackerService } from './tracker.service';

describe('TrackerController', () => {
  let trackerController: TrackerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TrackerController],
      providers: [TrackerService],
    }).compile();

    trackerController = app.get<TrackerController>(TrackerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(trackerController.getHello()).toBe('Hello World!');
    });
  });
});
