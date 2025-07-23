import { forwardRef, useImperativeHandle, useRef } from 'react';
import Video from './video';
import Quiz from './quiz';
import { questionBankRef } from '@/types/quiz.types';
import Article from './article';
import type { ArticleRef } from "@/types/article.types";
import type { Item, ItemContainerProps, ItemContainerRef } from '@/types/item-container.types';

const ItemContainer = forwardRef<ItemContainerRef, ItemContainerProps>(({ item, doGesture, onNext, onPrevVideo, isProgressUpdating, attemptId, anomalies, setQuizPassed, setAttemptId, rewindVid, pauseVid, displayNextLesson}, ref) => {
  const articleRef = useRef<ArticleRef>(null);

  // ✅ Expose stop function to parent
  useImperativeHandle(ref, () => ({
    stopCurrentItem: () => {
      if (articleRef.current) {
        articleRef.current.stopItem();
      }
    }
  }));

  const renderContent = () => {
    const itemType = item.type.toLowerCase();

    switch (itemType) {
      case 'video':
        return <Video
          URL={item.details?.URL ? item.details.URL : ''}
          startTime={item.details?.startTime ? item.details.startTime : ''}
          endTime={item.details?.endTime ? item.details.endTime : ''}
          points={item.details?.points ? item.details.points : ''}
          doGesture={doGesture}
          onNext={onNext}
          isProgressUpdating={isProgressUpdating}
          rewindVid={rewindVid || false}
          pauseVid={pauseVid || false}
          anomalies={anomalies}
        />;

      case 'quiz':
        return <Quiz
          questionBankRefs={item.details?.questionBankRefs || []}
          passThreshold={item.details?.passThreshold || 0}
          maxAttempts={item.details?.maxAttempts || 1}
          quizType={item.details?.quizType || ''}
          releaseTime={item.details?.releaseTime}
          questionVisibility={item.details?.questionVisibility || 0}
          deadline={item.details?.deadline}
          approximateTimeToComplete={item.details?.approximateTimeToComplete || ''}
          allowPartialGrading={item.details?.allowPartialGrading || false}
          allowHint={item.details?.allowHint || false}
          showCorrectAnswersAfterSubmission={item.details?.showCorrectAnswersAfterSubmission || false}
          showExplanationAfterSubmission={item.details?.showExplanationAfterSubmission || false}
          showScoreAfterSubmission={item.details?.showScoreAfterSubmission || false}
          quizId={item._id || ''}
          doGesture={doGesture}
          onNext={onNext}
          onPrevVideo={onPrevVideo}
          isProgressUpdating={isProgressUpdating}
          attemptId={attemptId}
          setAttemptId={setAttemptId}
          displayNextLesson={displayNextLesson}
          setQuizPassed={setQuizPassed}
          rewindVid={rewindVid}
        />;

      case 'article':
      case 'blog':
        return <Article
          ref={articleRef}
          content={item.details?.content || ''}
          estimatedReadTimeInMinutes={item.details?.estimatedReadTimeInMinutes || ''}
          tags={item.details?.tags || []}
          points={item.details?.points || ''}
          onNext={onNext}
          isProgressUpdating={isProgressUpdating}
        />;

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Unsupported item type: {item.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full w-full overflow-auto">
      {renderContent()}
    </div>
  );
});

ItemContainer.displayName = 'ItemContainer';

export default ItemContainer;