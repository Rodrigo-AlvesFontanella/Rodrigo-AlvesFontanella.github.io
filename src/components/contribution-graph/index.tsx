import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { skeleton } from '../../utils';

interface Contribution {
  date: string;
  count: number;
  level: number;
}

interface ContributionResponse {
  total: Record<string, number>;
  contributions: Contribution[];
}

type Period = 'last' | number;

const API_URL = 'https://github-contributions-api.jogruber.de/v4';

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;
const LEFT = 30;
const TOP = 18;

// GitHub's own greens; level 0 follows the active theme instead.
const LEVEL_COLORS = ['', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const DAY_LABELS: Record<number, string> = { 1: 'Mon', 3: 'Wed', 5: 'Fri' };

const parseDate = (date: string): Date => new Date(`${date}T00:00:00Z`);

/**
 * Groups a flat list of days into GitHub-style week columns (Sunday first).
 *
 * @param {Contribution[]} days - contribution days in ascending date order
 * @return {Array<Array<Contribution | null>>} weeks of 7 slots; null pads the
 * days that fall outside the range
 */
const toWeeks = (days: Contribution[]): Array<Array<Contribution | null>> => {
  const weeks: Array<Array<Contribution | null>> = [];
  let week: Array<Contribution | null> = [];

  days.forEach((day, index) => {
    const weekday = parseDate(day.date).getUTCDay();
    if (index === 0) {
      week = Array(weekday).fill(null);
    }
    week.push(day);
    if (weekday === 6) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    weeks.push(week);
  }

  return weeks;
};

/**
 * Picks which week columns get a month label: the first column whose first
 * slot is filled, for each new month.
 *
 * @param {Array<Array<Contribution | null>>} weeks - week columns
 * @return {Array<number | null>} month index per column, or null for no label
 */
const toMonthLabels = (
  weeks: Array<Array<Contribution | null>>,
): Array<number | null> => {
  const labels: Array<number | null> = [];
  let lastMonth = -1;

  for (const week of weeks) {
    const first = week[0];
    const month = first ? parseDate(first.date).getUTCMonth() : -1;
    if (first && month !== lastMonth) {
      labels.push(month);
      lastMonth = month;
    } else {
      labels.push(null);
    }
  }

  return labels;
};

const formatDay = (day: Contribution): string => {
  const label = parseDate(day.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const count = day.count === 0 ? 'No' : day.count;

  return `${count} contribution${day.count === 1 ? '' : 's'} on ${label}`;
};

const ContributionGraph = ({
  header,
  username,
  createdAt,
  loading,
}: {
  header: string;
  username: string;
  createdAt?: string;
  loading: boolean;
}) => {
  const [period, setPeriod] = useState<Period>('last');
  const [data, setData] = useState<ContributionResponse | null>(null);
  const [failed, setFailed] = useState<boolean>(false);

  const currentYear = new Date().getFullYear();
  const firstYear = createdAt ? new Date(createdAt).getFullYear() : currentYear;
  const years = useMemo(() => {
    const list: number[] = [];
    for (let year = currentYear; year >= firstYear; year--) {
      list.push(year);
    }
    return list;
  }, [currentYear, firstYear]);

  useEffect(() => {
    let cancelled = false;

    axios
      .get<ContributionResponse>(`${API_URL}/${username}`, {
        params: { y: period },
      })
      .then((response) => {
        if (!cancelled) {
          setData(response.data);
          setFailed(false);
        }
      })
      .catch((error) => {
        console.error('Error loading contributions:', error);
        if (!cancelled) {
          setFailed(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [username, period]);

  const weeks = useMemo(
    () => (data ? toWeeks(data.contributions) : []),
    [data],
  );

  const monthLabels = useMemo(() => toMonthLabels(weeks), [weeks]);

  // A failed request hides the card rather than showing a broken graph.
  if (failed && !data) {
    return null;
  }

  const total = data
    ? Object.values(data.total).reduce((sum, value) => sum + value, 0)
    : 0;
  const title = period === 'last' ? 'in the last year' : `in ${period}`;
  const width = LEFT + weeks.length * STEP;
  const height = TOP + 7 * STEP;

  const renderGraph = () => (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto min-w-[640px]"
      role="img"
      aria-label={`${total} contributions ${title}`}
    >
      {Object.entries(DAY_LABELS).map(([weekday, label]) => (
        <text
          key={label}
          x={0}
          y={TOP + Number(weekday) * STEP + CELL - 1}
          fontSize={9}
          className="fill-current opacity-70"
        >
          {label}
        </text>
      ))}
      {weeks.map((week, weekIndex) => {
        const month = monthLabels[weekIndex];

        return (
          <g
            key={weekIndex}
            transform={`translate(${LEFT + weekIndex * STEP} 0)`}
          >
            {month !== null && (
              <text y={10} fontSize={10} className="fill-current opacity-70">
                {MONTHS[month]}
              </text>
            )}
            {week.map(
              (day, dayIndex) =>
                day && (
                  <rect
                    key={day.date}
                    y={TOP + dayIndex * STEP}
                    width={CELL}
                    height={CELL}
                    rx={2}
                    ry={2}
                    fill={
                      day.level === 0
                        ? 'var(--color-base-content)'
                        : LEVEL_COLORS[day.level]
                    }
                    fillOpacity={day.level === 0 ? 0.1 : 1}
                  >
                    <title>{formatDay(day)}</title>
                  </rect>
                ),
            )}
          </g>
        );
      })}
    </svg>
  );

  return (
    <div className="card shadow-md card-sm bg-base-100 mb-6">
      <div className="card-body">
        <div className="mx-3 mb-2">
          <h5 className="card-title">
            {loading ? (
              skeleton({ widthCls: 'w-40', heightCls: 'h-8' })
            ) : (
              <span className="text-base-content opacity-70">{header}</span>
            )}
          </h5>
        </div>
        <div className="mx-3 flex flex-col gap-3">
          {loading || !data ? (
            skeleton({
              widthCls: 'w-full',
              heightCls: 'h-32',
              shape: 'rounded-box',
            })
          ) : (
            <>
              <div className="text-base-content">
                <span className="font-semibold">
                  {total.toLocaleString('en-US')}
                </span>{' '}
                contributions {title}
              </div>
              <div className="overflow-x-auto">{renderGraph()}</div>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-base-content opacity-70">
                <a
                  href="https://docs.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile"
                  target="_blank"
                  rel="noreferrer"
                  className="link link-hover"
                >
                  Learn how we count contributions
                </a>
                <div className="flex items-center gap-1">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <span
                      key={level}
                      className="inline-block rounded-sm"
                      style={{
                        width: CELL,
                        height: CELL,
                        background:
                          level === 0
                            ? 'color-mix(in srgb, var(--color-base-content) 10%, transparent)'
                            : LEVEL_COLORS[level],
                      }}
                    />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </>
          )}
          <div className="flex flex-wrap gap-1">
            {(['last', ...years] as Period[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPeriod(item)}
                className={`btn btn-xs ${
                  period === item ? 'btn-primary' : 'btn-ghost'
                }`}
              >
                {item === 'last' ? 'Last year' : item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;
