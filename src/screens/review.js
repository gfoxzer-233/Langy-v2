/* ============================================
   SCREEN: REVIEW
   Spaced practice hub for mistakes, vocab and skill health.
   ============================================ */

function getReviewStats() {
    const queue = Array.isArray(LangyState.progress?.reviewQueue) ? LangyState.progress.reviewQueue : [];
    const vocabDue =
        typeof VocabTracker !== 'undefined' && typeof VocabTracker.getDueWords === 'function'
            ? VocabTracker.getDueWords().length
            : 0;
    const skills = LangyState.progress?.skills || {};
    const listeningDue = (skills.listening || 0) < 65 ? 1 : 0;
    const grammarDue = queue.filter(item => item.type === 'fill-bubble' || item.type === 'type-translation').length;
    const mistakesDue = queue.length;
    const estimatedMinutes = Math.max(5, Math.min(20, Math.ceil((vocabDue + mistakesDue + listeningDue + grammarDue) * 1.5)));
    return {
        queue,
        vocabDue,
        grammarDue,
        mistakesDue,
        listeningDue,
        estimatedMinutes,
    };
}

function renderReviewMetric(icon, label, value, desc) {
    return `
        <article class="review-metric">
            <span class="review-metric__icon">${icon}</span>
            <div>
                <strong>${escapeHTML(String(value))}</strong>
                <span>${escapeHTML(label)}</span>
                <p>${escapeHTML(desc)}</p>
            </div>
        </article>
    `;
}

function renderReview(container) {
    const stats = getReviewStats();
    const active = typeof LangyCurriculum !== 'undefined' ? LangyCurriculum.getActive?.() : null;
    const currentUnit = active?.units?.find(unit => unit.id === LangyState.progress?.currentUnitId) || active?.units?.[0];
    const hasWork = stats.vocabDue + stats.grammarDue + stats.mistakesDue + stats.listeningDue > 0;
    const firstReviewItem = stats.queue[0];

    container.innerHTML = `
        <div class="screen review-screen">
            <header class="review-hero">
                <button type="button" class="nav-header__back" id="review-back" aria-label="Back">${LangyIcons.back}</button>
                <div class="review-hero__copy">
                    <span class="badge badge--primary">${LangyIcons.refresh} Review</span>
                    <h1>Practice what needs attention</h1>
                    <p>${hasWork ? 'Omar grouped your due practice into one focused session.' : 'No urgent review is due. You can still warm up with the current lesson.'}</p>
                </div>
                <img src="assets/mascots/omar.png" alt="" class="review-hero__mascot" aria-hidden="true">
            </header>

            <section class="review-metrics" aria-label="Review queue">
                ${renderReviewMetric(LangyIcons.bookOpen, 'Vocabulary due', stats.vocabDue, 'Words scheduled by spaced repetition')}
                ${renderReviewMetric(LangyIcons.brain, 'Grammar due', stats.grammarDue, 'Rules linked to wrong answers')}
                ${renderReviewMetric(LangyIcons.alertTriangle, 'Past mistakes', stats.mistakesDue, 'Exercises queued from lesson feedback')}
                ${renderReviewMetric(LangyIcons.headphones, 'Listening due', stats.listeningDue, 'Skill health below target')}
            </section>

            <section class="review-plan">
                <div>
                    <span>Estimated time</span>
                    <strong>${stats.estimatedMinutes} minutes</strong>
                </div>
                <div>
                    <span>Starting point</span>
                    <strong>${escapeHTML(firstReviewItem?.prompt || currentUnit?.title || 'Current lesson')}</strong>
                </div>
            </section>

            ${
                stats.queue.length
                    ? `
            <div class="review-queue-list">
                ${stats.queue.slice(0, 4).map(item => `
                    <div class="review-queue-item">
                        <span>${LangyIcons.refresh}</span>
                        <div>
                            <strong>${escapeHTML(item.prompt || item.type || 'Review item')}</strong>
                            <p>${escapeHTML(item.correctAnswer || item.explanation || 'Practice again')}</p>
                        </div>
                    </div>
                `).join('')}
            </div>`
                    : `
            <div class="empty-state review-empty">
                <div class="empty-state__icon">${LangyIcons.checkCircle}</div>
                <div class="empty-state__title">Review queue is healthy</div>
                <div class="empty-state__text">Keep the rhythm by continuing your next lesson.</div>
            </div>`
            }

            <button type="button" class="btn btn--primary btn--xl btn--full" id="review-start">
                ${LangyIcons.play} ${hasWork ? 'Start Review' : 'Warm up with lesson'}
            </button>
        </div>
    `;

    container.querySelector('#review-back')?.addEventListener('click', () => Router.navigate('home'));
    container.querySelector('#review-start')?.addEventListener('click', () => {
        const unitId = firstReviewItem?.unitId || currentUnit?.id || LangyState.progress?.currentUnitId || 1;
        Router.navigate('learning', { mode: 'review', unitId });
    });
}

Router.register('review', renderReview);
