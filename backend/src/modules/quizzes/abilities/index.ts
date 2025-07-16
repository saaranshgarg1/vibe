export * from './types.js';
export * from './quizAbilities.js';
export * from './questionAbilities.js';
export * from './questionBankAbilities.js';
export * from './attemptAbilities.js';

// Unified setup function for all quiz abilities
import { AbilityBuilder } from '@casl/ability';
import { AuthenticatedUser } from '#shared/interfaces/models.js';
import { setupQuizAbilities } from './quizAbilities.js';
import { setupQuestionAbilities } from './questionAbilities.js';
import { setupQuestionBankAbilities } from './questionBankAbilities.js';
import { setupAttemptAbilities } from './attemptAbilities.js';

export async function setupAllQuizAbilities(
    builder: AbilityBuilder<any>,
    user: AuthenticatedUser,
    subject?: string
) {
    // If a specific subject is provided, we can conditionally setup abilities
    if (subject) {
        switch (subject) {
            case 'Quiz':
                setupQuizAbilities(builder, user);
                break;
            case 'Question':
                setupQuestionAbilities(builder, user);
                break;
            case 'QuestionBank':
                setupQuestionBankAbilities(builder, user);
                break;
            case 'Attempt':
                await setupAttemptAbilities(builder, user);
                break;
        }
    } else {
        setupQuizAbilities(builder, user);
        setupQuestionAbilities(builder, user);
        setupQuestionBankAbilities(builder, user);
        await setupAttemptAbilities(builder, user);
    }
}