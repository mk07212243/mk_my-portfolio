export type Language = "python" | "c" | "javascript";

export type Category =
  | { kind: "level"; level: number }
  | { kind: "topic"; topicId: string }
  | { kind: "stock" };

export type Quiz = {
  question: string;
  choices: string[];
  correctIndex: number;
};

export type Problem = {
  id: string;
  title: string;
  language: Language;
  category: Category;
  code: string;
  explanation: string;
  quiz?: Quiz;
  isGenerated?: boolean;
  isImported?: boolean;
};

// トピックの表示ラベル。新しいテーマ(for文など)を追加する際はここに1行足すだけでよい。
export const topicLabels: Record<string, string> = {
  if: "if文",
};

// レベルの表示ラベル。レベルを追加する際はここに1行足すだけでよい。
export const levelInfo: Record<number, { label: string }> = {
  1: { label: "変数・出力" },
  2: { label: "関数と計算" },
  3: { label: "条件分岐" },
  4: { label: "繰り返し" },
  5: { label: "応用" },
};

export const problems: Problem[] = [
  // ===== Python: Lv1 変数・出力 =====
  {
    id: "py-hello-print",
    title: "変数を使った挨拶メッセージ",
    language: "python",
    category: { kind: "level", level: 1 },
    code: `name = "Alice"
print("Hello, " + name)`,
    explanation:
      "変数 name に文字列 \"Alice\" を代入し、\"Hello, \" と文字列を連結して print で出力するプログラムです。実行すると \"Hello, Alice\" と表示されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["Hello, Alice", "Alice, Hello", "Hello, name", "エラーになる"],
      correctIndex: 0,
    },
  },
  {
    id: "py-simple-sum",
    title: "2つの数の合計を出力",
    language: "python",
    category: { kind: "level", level: 1 },
    code: `a = 3
b = 4
print(a + b)`,
    explanation:
      "変数 a と b にそれぞれ 3 と 4 を代入し、その合計を print で出力するだけのプログラムです。実行すると 7 が表示されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["3", "4", "7", "34"],
      correctIndex: 2,
    },
  },
  // ===== Python: Lv2 関数と計算 =====
  {
    id: "py-function-square",
    title: "二乗を返す関数",
    language: "python",
    category: { kind: "level", level: 2 },
    code: `def square(x):
    return x * x

print(square(5))`,
    explanation:
      "引数 x を受け取り、x * x（xの二乗）を返す関数 square です。square(5) を呼び出すと 25 が返り、print で出力されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["5", "10", "25", "None"],
      correctIndex: 2,
    },
  },
  {
    id: "py-area-calc",
    title: "長方形の面積を計算",
    language: "python",
    category: { kind: "level", level: 2 },
    code: `width = 4
height = 6
area = width * height
print(area)`,
    explanation:
      "width と height という2つの変数を掛け合わせて面積を計算し、print で出力するプログラムです。4 × 6 なので 24 が出力されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["10", "24", "46", "64"],
      correctIndex: 1,
    },
  },
  // ===== Python: Lv3 条件分岐 =====
  {
    id: "py-even-odd",
    title: "偶数・奇数を判定するif文",
    language: "python",
    category: { kind: "level", level: 3 },
    code: `n = 9

if n % 2 == 0:
    print("even")
else:
    print("odd")`,
    explanation:
      "n を2で割った余り（n % 2）が0かどうかで偶数・奇数を判定するif-else文です。9を2で割った余りは1なので、else側が実行され \"odd\" が出力されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["even", "odd", "9", "何も出力されない"],
      correctIndex: 1,
    },
  },
  {
    id: "py-max-of-three",
    title: "3つの値の最大値を求めるif文",
    language: "python",
    category: { kind: "level", level: 3 },
    code: `a, b, c = 4, 9, 7

if a >= b and a >= c:
    largest = a
elif b >= a and b >= c:
    largest = b
else:
    largest = c

print(largest)`,
    explanation:
      "a, b, c の3つの値を比較し、最大の値を largest に代入するif-elif-else文です。aが最大かどうか、次にbが最大かどうかを順に調べ、どちらでもなければcが最大と判断します。この例では9が最大なので9が出力されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["4", "7", "9", "エラーになる"],
      correctIndex: 2,
    },
  },
  // ===== Python: Lv4 繰り返し =====
  {
    id: "py-sum-loop",
    title: "forループで1から5までの合計を求める",
    language: "python",
    category: { kind: "level", level: 4 },
    code: `total = 0
for i in range(1, 6):
    total += i

print(total)`,
    explanation:
      "total を0で初期化し、range(1, 6) が生成する 1,2,3,4,5 を順に total に足し込んでいくforループです。1+2+3+4+5 の合計である 15 が出力されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["5", "10", "15", "21"],
      correctIndex: 2,
    },
  },
  {
    id: "py-max-in-list",
    title: "リストの最大値を求めるforループ",
    language: "python",
    category: { kind: "level", level: 4 },
    code: `nums = [4, 9, 2, 7, 5]
max_num = nums[0]

for n in nums:
    if n > max_num:
        max_num = n

print(max_num)`,
    explanation:
      "リストの先頭要素を仮の最大値としておき、forループで残りの要素と順に比較して、より大きい値が見つかるたびに max_num を更新していくプログラムです。最終的にリスト内の最大値である 9 が出力されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["4", "5", "7", "9"],
      correctIndex: 3,
    },
  },
  // ===== Python: Lv5 応用 =====
  {
    id: "py-fibonacci",
    title: "再帰によるフィボナッチ数列",
    language: "python",
    category: { kind: "level", level: 5 },
    code: `def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(10))`,
    explanation:
      "フィボナッチ数列のn番目の値を再帰で計算する関数です。n が 0 か 1 のときはそのまま返し、それ以外は「1つ前」と「2つ前」の値を再帰的に呼び出して足し合わせます。fib(10) を呼ぶと 55 が出力されます。",
    quiz: {
      question: "この関数は最終的に何を出力しますか?",
      choices: ["10", "55", "89", "エラーになる"],
      correctIndex: 1,
    },
  },
  {
    id: "py-stack-class",
    title: "スタックを実装するクラス",
    language: "python",
    category: { kind: "level", level: 5 },
    code: `class Stack:
    def __init__(self):
        self._items = []

    def push(self, item):
        self._items.append(item)

    def pop(self):
        return self._items.pop()

    def is_empty(self):
        return len(self._items) == 0`,
    explanation:
      "リストを内部データとして使い、後入れ先出し（LIFO）のスタック構造を実装したクラスです。push で末尾に要素を追加し、pop で末尾の要素を取り出して削除します。is_empty はスタックが空かどうかを真偽値で返します。",
  },
  {
    id: "py-decorator",
    title: "実行時間を計測するデコレータ",
    language: "python",
    category: { kind: "level", level: 5 },
    code: `import time
import functools

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.time() - start:.4f}s")
        return result
    return wrapper

@timer
def slow_add(a, b):
    time.sleep(0.1)
    return a + b

slow_add(2, 3)`,
    explanation:
      "timer は、渡された関数を実行しつつ実行時間を計測して表示する「デコレータ」です。@timer を付けた slow_add は、呼び出すと本来の処理（0.1秒待って加算）に加え、実行後に何秒かかったかがコンソールに表示されます。functools.wraps は元の関数名などの情報を保つためのものです。",
    quiz: {
      question: "slow_add(2, 3) を実行すると何が起こりますか?",
      choices: [
        "5 が返るだけで何も表示されない",
        "5 が返り、かつ実行時間がコンソールに表示される",
        "エラーになる",
        "0.1秒待たずに即座に5が返る",
      ],
      correctIndex: 1,
    },
  },
  // ===== Python: 文法テーマ「if文」 =====
  {
    id: "py-if-grade",
    title: "点数から成績を判定するif文",
    language: "python",
    category: { kind: "topic", topicId: "if" },
    code: `score = 82

if score >= 90:
    grade = "A"
elif score >= 70:
    grade = "B"
elif score >= 50:
    grade = "C"
else:
    grade = "D"

print(grade)`,
    explanation:
      "score の値を上から順に条件と比較し、最初に当てはまった条件のブロックだけを実行するif-elif-else文です。82は90以上ではないが70以上なので、2番目の条件に当てはまり grade は \"B\" になります。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["A", "B", "C", "D"],
      correctIndex: 1,
    },
  },
  {
    id: "py-if-discount",
    title: "金額に応じて割引を適用するif文",
    language: "python",
    category: { kind: "topic", topicId: "if" },
    code: `price = 1200

if price >= 1000:
    discount = price * 0.1
else:
    discount = 0

final_price = price - discount
print(final_price)`,
    explanation:
      "価格が1000円以上のときだけ10%の割引を適用するif-else文です。1200円は条件を満たすので120円が割引され、最終価格として1080.0が出力されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["1200", "1080.0", "120", "0"],
      correctIndex: 1,
    },
  },
  {
    id: "py-if-leap-year",
    title: "うるう年を判定するif文",
    language: "python",
    category: { kind: "topic", topicId: "if" },
    code: `year = 2024

if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0):
    is_leap = True
else:
    is_leap = False

print(is_leap)`,
    explanation:
      "「4で割り切れる、かつ（100で割り切れない、または400で割り切れる）」という条件でうるう年かどうかを判定するif-else文です。2024は4で割り切れて100では割り切れないため条件を満たし、Trueが出力されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["True", "False", "2024", "エラーになる"],
      correctIndex: 0,
    },
  },

  // ===== C: Lv1 変数・出力 =====
  {
    id: "c-hello-print",
    title: "文字列を出力するプログラム",
    language: "c",
    category: { kind: "level", level: 1 },
    code: `#include <stdio.h>

int main(void) {
    printf("Hello, C!\\n");
    return 0;
}`,
    explanation:
      "printf を使って画面に文字列を出力するだけの、最も基本的なCのプログラムです。実行すると \"Hello, C!\" と表示されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["Hello, C!", "Hello, World!", "C!", "何も出力されない"],
      correctIndex: 0,
    },
  },
  {
    id: "c-sum",
    title: "2つの整数の合計を計算するプログラム",
    language: "c",
    category: { kind: "level", level: 1 },
    code: `#include <stdio.h>

int main(void) {
    int a = 3;
    int b = 5;
    int sum = a + b;
    printf("%d\\n", sum);
    return 0;
}`,
    explanation:
      "変数 a と b にそれぞれ 3 と 5 を代入し、その合計を sum に格納して printf で出力するプログラムです。実行すると 8 が表示されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["3", "5", "8", "何も出力されない"],
      correctIndex: 2,
    },
  },
  // ===== C: Lv2 関数と計算 =====
  {
    id: "c-function-square",
    title: "二乗を返す関数",
    language: "c",
    category: { kind: "level", level: 2 },
    code: `#include <stdio.h>

int square(int x) {
    return x * x;
}

int main(void) {
    printf("%d\\n", square(5));
    return 0;
}`,
    explanation:
      "引数 x を受け取り、x * x（xの二乗）を返す関数 square です。main の中で square(5) を呼び出すと 25 が返り、printf で出力されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["5", "10", "25", "コンパイルエラーになる"],
      correctIndex: 2,
    },
  },
  {
    id: "c-area-calc",
    title: "長方形の面積を計算するプログラム",
    language: "c",
    category: { kind: "level", level: 2 },
    code: `#include <stdio.h>

int main(void) {
    int width = 4;
    int height = 6;
    int area = width * height;
    printf("%d\\n", area);
    return 0;
}`,
    explanation:
      "width と height という2つの変数を掛け合わせて面積を計算し、printf で出力するプログラムです。4 × 6 なので 24 が出力されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["10", "24", "46", "64"],
      correctIndex: 1,
    },
  },
  // ===== C: Lv3 条件分岐 =====
  {
    id: "c-max-of-three",
    title: "3つの値の最大値を求めるif文",
    language: "c",
    category: { kind: "level", level: 3 },
    code: `#include <stdio.h>

int main(void) {
    int a = 4, b = 9, c = 7;
    int largest;

    if (a >= b && a >= c) {
        largest = a;
    } else if (b >= a && b >= c) {
        largest = b;
    } else {
        largest = c;
    }

    printf("%d\\n", largest);
    return 0;
}`,
    explanation:
      "a, b, c の3つの値を比較し、最大の値を largest に代入するif-else if-else文です。aが最大かどうか、次にbが最大かどうかを順に調べ、どちらでもなければcが最大と判断します。この例では9が最大なので9が出力されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["4", "7", "9", "コンパイルエラーになる"],
      correctIndex: 2,
    },
  },
  {
    id: "c-temp-classify",
    title: "気温を分類するif文",
    language: "c",
    category: { kind: "level", level: 3 },
    code: `#include <stdio.h>

int main(void) {
    int temp = 28;

    if (temp >= 30) {
        printf("hot\\n");
    } else if (temp >= 20) {
        printf("warm\\n");
    } else {
        printf("cold\\n");
    }

    return 0;
}`,
    explanation:
      "temp の値を上から順に条件と比較し、最初に当てはまった条件のブロックだけを実行するif-else if-else文です。28は30以上ではないが20以上なので、2番目の条件に当てはまり \"warm\" が出力されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["hot", "warm", "cold", "28"],
      correctIndex: 1,
    },
  },
  // ===== C: Lv4 繰り返し =====
  {
    id: "c-sum-loop",
    title: "forループで1から5までの合計を求める",
    language: "c",
    category: { kind: "level", level: 4 },
    code: `#include <stdio.h>

int main(void) {
    int total = 0;

    for (int i = 1; i <= 5; i++) {
        total += i;
    }

    printf("%d\\n", total);
    return 0;
}`,
    explanation:
      "total を0で初期化し、i を1から5まで1ずつ増やしながら total に足し込んでいくforループです。1+2+3+4+5 の合計である 15 が出力されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["5", "10", "15", "21"],
      correctIndex: 2,
    },
  },
  {
    id: "c-array-max",
    title: "配列の最大値を求めるプログラム",
    language: "c",
    category: { kind: "level", level: 4 },
    code: `#include <stdio.h>

int main(void) {
    int nums[] = {4, 9, 2, 7, 5};
    int max = nums[0];

    for (int i = 1; i < 5; i++) {
        if (nums[i] > max) {
            max = nums[i];
        }
    }

    printf("%d\\n", max);
    return 0;
}`,
    explanation:
      "配列 nums の先頭要素を仮の最大値としておき、残りの要素を順に比較して、より大きい値が見つかるたびに max を更新していくプログラムです。最終的に配列内の最大値である 9 が出力されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["4", "5", "7", "9"],
      correctIndex: 3,
    },
  },
  // ===== C: Lv5 応用 =====
  {
    id: "c-struct-point",
    title: "構造体を使った距離の計算",
    language: "c",
    category: { kind: "level", level: 5 },
    code: `#include <stdio.h>

struct Point {
    int x;
    int y;
};

int main(void) {
    struct Point p = {3, 4};
    int distanceSquared = p.x * p.x + p.y * p.y;
    printf("%d\\n", distanceSquared);
    return 0;
}`,
    explanation:
      "x と y という2つの整数をまとめて持つ構造体 Point を定義し、原点からの距離の2乗（x*x + y*y）を計算するプログラムです。3の二乗9と4の二乗16を足した 25 が出力されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["7", "12", "25", "34"],
      correctIndex: 2,
    },
  },
  {
    id: "c-recursive-factorial",
    title: "再帰による階乗の計算",
    language: "c",
    category: { kind: "level", level: 5 },
    code: `#include <stdio.h>

int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main(void) {
    printf("%d\\n", factorial(5));
    return 0;
}`,
    explanation:
      "n の階乗を再帰で計算する関数です。n が1以下なら1を返し、それ以外は n と factorial(n - 1) の積を返します。factorial(5) は 5×4×3×2×1 を計算し、120 が出力されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["5", "24", "60", "120"],
      correctIndex: 3,
    },
  },
  // ===== C: 文法テーマ「if文」 =====
  {
    id: "c-if-even-odd",
    title: "偶数・奇数を判定するif文",
    language: "c",
    category: { kind: "topic", topicId: "if" },
    code: `#include <stdio.h>

int main(void) {
    int n = 7;

    if (n % 2 == 0) {
        printf("even\\n");
    } else {
        printf("odd\\n");
    }

    return 0;
}`,
    explanation:
      "n を2で割った余り（n % 2）が0かどうかで偶数・奇数を判定するif-else文です。7を2で割った余りは1で0ではないので、else側が実行され \"odd\" が出力されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["even", "odd", "7", "何も出力されない"],
      correctIndex: 1,
    },
  },
  {
    id: "c-if-password-length",
    title: "パスワードの長さをチェックするif文",
    language: "c",
    category: { kind: "topic", topicId: "if" },
    code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char password[] = "hunter2";

    if (strlen(password) >= 8) {
        printf("valid\\n");
    } else {
        printf("too short\\n");
    }

    return 0;
}`,
    explanation:
      "strlen で文字列の長さを調べ、8文字以上かどうかで判定するif-else文です。\"hunter2\" は7文字なので条件を満たさず、else側が実行されて \"too short\" が出力されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["valid", "too short", "7", "8"],
      correctIndex: 1,
    },
  },
  {
    id: "c-if-triangle-check",
    title: "三角形が成立するか判定するif文",
    language: "c",
    category: { kind: "topic", topicId: "if" },
    code: `#include <stdio.h>

int main(void) {
    int a = 3, b = 4, c = 5;

    if (a + b > c && a + c > b && b + c > a) {
        printf("valid triangle\\n");
    } else {
        printf("invalid triangle\\n");
    }

    return 0;
}`,
    explanation:
      "三角形が成立する条件（どの2辺の和も残りの1辺より大きいこと）をif-else文で判定するプログラムです。3, 4, 5 はこの条件をすべて満たすため \"valid triangle\" が出力されます。",
    quiz: {
      question: "このプログラムを実行すると何が出力されますか?",
      choices: ["valid triangle", "invalid triangle", "12", "コンパイルエラーになる"],
      correctIndex: 0,
    },
  },

  // ===== JavaScript（既存2問、レベルのみ再配置） =====
  {
    id: "js-debounce",
    title: "デバウンス関数",
    language: "javascript",
    category: { kind: "level", level: 4 },
    code: `function debounce(fn, delay) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
}

const log = debounce((msg) => console.log(msg), 300);
log("a");
log("b");
log("c");`,
    explanation:
      "短時間に何度も呼ばれる関数の実行を「最後の呼び出しからdelayミリ秒経つまで」遅らせるユーティリティです。呼ばれるたびに前のタイマーを取り消し、新しいタイマーを設定し直すため、連続で呼ばれている間は実行されず、呼び出しが止まってから一度だけ実行されます。上の例では最終的に console.log('c') だけが実行されます。",
    quiz: {
      question: "log('a'), log('b'), log('c') を連続で呼んだ結果、最終的にconsoleに出力される内容は?",
      choices: ["a, b, c すべて", "a だけ", "c だけ", "何も出力されない"],
      correctIndex: 2,
    },
  },
  {
    id: "js-promise-chain",
    title: "Promiseチェーンによる非同期処理",
    language: "javascript",
    category: { kind: "level", level: 5 },
    code: `function fetchUser(id) {
  return Promise.resolve({ id, name: "Alice" });
}

function fetchPosts(user) {
  return Promise.resolve([\`\${user.name}'s post 1\`, \`\${user.name}'s post 2\`]);
}

fetchUser(1)
  .then(fetchPosts)
  .then((posts) => console.log(posts))
  .catch((err) => console.error(err));`,
    explanation:
      "ユーザー情報を取得してから、そのユーザーの投稿一覧を取得する、という2段階の非同期処理をPromiseチェーンでつないでいます。fetchUser の結果が fetchPosts に渡り、その結果が最後の then でログ出力されます。途中でエラーが起きれば catch にジャンプします。",
    quiz: {
      question: "このコードの処理の順序として正しいものは?",
      choices: [
        "投稿取得 → ユーザー取得 → ログ出力",
        "ユーザー取得 → 投稿取得 → ログ出力",
        "ユーザー取得とログ出力が同時に実行される",
        "順序は不定",
      ],
      correctIndex: 1,
    },
  },
];
