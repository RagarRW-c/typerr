export type Difficulty = "easy" | "medium" | "hard";
export type Category = "algorithms" | "web" | "data-structures" | "basics" | "functions" | "loops" | "classes";

export interface Snippet {
  id: string;
  lang: string;
  difficulty: Difficulty;
  category: Category;
  text: string;
  description?: string;
}

export const SNIPPETS: Snippet[] = [
  // ========== PYTHON ==========
  {
    id: "py_factorial",
    lang: "python",
    difficulty: "easy",
    category: "algorithms",
    text: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,
    description: "Recursive factorial function"
  },
  {
    id: "py_fibonacci",
    lang: "python",
    difficulty: "easy",
    category: "algorithms",
    text: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)`,
    description: "Fibonacci sequence"
  },
  {
    id: "py_list_comp",
    lang: "python",
    difficulty: "easy",
    category: "basics",
    text: `squares = [x**2 for x in range(10)]
evens = [x for x in squares if x % 2 == 0]
print(evens)`,
    description: "List comprehension basics"
  },
  {
    id: "py_class_basic",
    lang: "python",
    difficulty: "medium",
    category: "classes",
    text: `class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def bark(self):
        return f"{self.name} says woof!"`,
    description: "Basic class definition"
  },
  {
    id: "py_binary_search",
    lang: "python",
    difficulty: "medium",
    category: "algorithms",
    text: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    description: "Binary search algorithm"
  },
  {
    id: "py_quicksort",
    lang: "python",
    difficulty: "hard",
    category: "algorithms",
    text: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)`,
    description: "Quicksort implementation"
  },

  // ========== JAVASCRIPT ==========
  {
    id: "js_map",
    lang: "javascript",
    difficulty: "easy",
    category: "basics",
    text: `const doubled = [1,2,3].map(n => n * 2);
console.log(doubled);`,
    description: "Array map method"
  },
  {
    id: "js_arrow_func",
    lang: "javascript",
    difficulty: "easy",
    category: "functions",
    text: `const add = (a, b) => a + b;
const greet = name => \`Hello, \${name}!\`;
console.log(add(5, 3));
console.log(greet("World"));`,
    description: "Arrow functions"
  },
  {
    id: "js_promises",
    lang: "javascript",
    difficulty: "medium",
    category: "web",
    text: `const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: "Success!" });
    }, 1000);
  });
};

fetchData().then(result => console.log(result));`,
    description: "Promise basics"
  },
  {
    id: "js_async_await",
    lang: "javascript",
    difficulty: "medium",
    category: "web",
    text: `async function getData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}`,
    description: "Async/await syntax"
  },
  {
    id: "js_class",
    lang: "javascript",
    difficulty: "medium",
    category: "classes",
    text: `class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  
  area() {
    return this.width * this.height;
  }
}`,
    description: "ES6 class syntax"
  },
  {
    id: "js_closure",
    lang: "javascript",
    difficulty: "hard",
    category: "functions",
    text: `function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counter = createCounter();`,
    description: "Closure pattern"
  },

  // ========== TYPESCRIPT ==========
  {
    id: "ts_interface",
    lang: "typescript",
    difficulty: "easy",
    category: "basics",
    text: `interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "John",
  email: "john@example.com"
};`,
    description: "Interface definition"
  },
  {
    id: "ts_generic",
    lang: "typescript",
    difficulty: "medium",
    category: "functions",
    text: `function identity<T>(arg: T): T {
  return arg;
}

const result = identity<string>("Hello");
const num = identity<number>(42);`,
    description: "Generic functions"
  },
  {
    id: "ts_type_guard",
    lang: "typescript",
    difficulty: "hard",
    category: "functions",
    text: `type Fish = { swim: () => void };
type Bird = { fly: () => void };

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim();
  } else {
    pet.fly();
  }
}`,
    description: "Type guards"
  },

  // ========== GO ==========
  {
    id: "go_prime",
    lang: "go",
    difficulty: "medium",
    category: "algorithms",
    text: `func isPrime(n int) bool {
    if n < 2 { return false }
    for i := 2; i*i <= n; i++ {
        if n%i == 0 { return false }
    }
    return true
}`,
    description: "Prime number check"
  },
  {
    id: "go_struct",
    lang: "go",
    difficulty: "easy",
    category: "basics",
    text: `type Person struct {
    Name string
    Age  int
}

func (p Person) Greet() string {
    return fmt.Sprintf("Hi, I'm %s", p.Name)
}`,
    description: "Struct with method"
  },
  {
    id: "go_goroutine",
    lang: "go",
    difficulty: "medium",
    category: "functions",
    text: `func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)
    
    go worker(1, jobs, results)
}`,
    description: "Goroutines and channels"
  },

  // ========== RUST ==========
  {
    id: "rust_vec",
    lang: "rust",
    difficulty: "easy",
    category: "basics",
    text: `fn main() {
    let mut v = vec![1, 2, 3];
    v.push(4);
    
    for i in &v {
        println!("{}", i);
    }
}`,
    description: "Vector basics"
  },
  {
    id: "rust_ownership",
    lang: "rust",
    difficulty: "medium",
    category: "basics",
    text: `fn take_ownership(s: String) {
    println!("{}", s);
}

fn main() {
    let s = String::from("hello");
    take_ownership(s);
    // s is no longer valid here
}`,
    description: "Ownership concept"
  },
  {
    id: "rust_result",
    lang: "rust",
    difficulty: "hard",
    category: "functions",
    text: `use std::fs::File;
use std::io::Read;

fn read_file(path: &str) -> Result<String, std::io::Error> {
    let mut file = File::open(path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}`,
    description: "Error handling with Result"
  },

  // ========== JAVA ==========
  {
    id: "java_class",
    lang: "java",
    difficulty: "easy",
    category: "classes",
    text: `public class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public String getName() {
        return name;
    }
}`,
    description: "Basic class with constructor"
  },
  {
    id: "java_arraylist",
    lang: "java",
    difficulty: "easy",
    category: "data-structures",
    text: `import java.util.ArrayList;

ArrayList<String> list = new ArrayList<>();
list.add("Apple");
list.add("Banana");
list.add("Cherry");

for (String fruit : list) {
    System.out.println(fruit);
}`,
    description: "ArrayList usage"
  },
  {
    id: "java_stream",
    lang: "java",
    difficulty: "medium",
    category: "functions",
    text: `List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

int sum = numbers.stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * n)
    .reduce(0, Integer::sum);`,
    description: "Stream API"
  },

  // ========== C++ ==========
  {
    id: "cpp_vector",
    lang: "cpp",
    difficulty: "easy",
    category: "data-structures",
    text: `#include <vector>
#include <iostream>

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5};
    
    for (int n : nums) {
        std::cout << n << " ";
    }
    return 0;
}`,
    description: "Vector basics"
  },
  {
    id: "cpp_class",
    lang: "cpp",
    difficulty: "medium",
    category: "classes",
    text: `class Circle {
private:
    double radius;
public:
    Circle(double r) : radius(r) {}
    
    double area() const {
        return 3.14159 * radius * radius;
    }
};`,
    description: "Class with constructor"
  },
  {
    id: "cpp_template",
    lang: "cpp",
    difficulty: "hard",
    category: "functions",
    text: `template<typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    int i = max(10, 20);
    double d = max(3.14, 2.71);
    return 0;
}`,
    description: "Template functions"
  },

  // ========== SQL ==========
  {
    id: "sql_select",
    lang: "sql",
    difficulty: "easy",
    category: "basics",
    text: `SELECT name, email, age
FROM users
WHERE age >= 18
ORDER BY name ASC;`,
    description: "Basic SELECT query"
  },
  {
    id: "sql_join",
    lang: "sql",
    difficulty: "medium",
    category: "basics",
    text: `SELECT u.name, o.order_id, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed';`,
    description: "JOIN query"
  },
  {
    id: "sql_subquery",
    lang: "sql",
    difficulty: "hard",
    category: "algorithms",
    text: `SELECT name, salary
FROM employees
WHERE salary > (
    SELECT AVG(salary)
    FROM employees
    WHERE department = 'Sales'
)
ORDER BY salary DESC;`,
    description: "Subquery with aggregate"
  },

  // ========== HTML/CSS ==========
  {
    id: "html_base",
    lang: "html",
    difficulty: "easy",
    category: "web",
    text: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Sample</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
    description: "Basic HTML structure"
  },
  {
    id: "html_form",
    lang: "html",
    difficulty: "medium",
    category: "web",
    text: `<form action="/submit" method="POST">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>
  
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>
  
  <button type="submit">Submit</button>
</form>`,
    description: "HTML form"
  },
  {
    id: "css_flexbox",
    lang: "css",
    difficulty: "medium",
    category: "web",
    text: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.item {
  flex: 1;
  padding: 1rem;
}`,
    description: "Flexbox layout"
  },
];

// Helper functions
export function getSnippetsByLanguage(lang: string): Snippet[] {
  return SNIPPETS.filter(s => s.lang === lang);
}

export function getSnippetsByDifficulty(difficulty: Difficulty): Snippet[] {
  return SNIPPETS.filter(s => s.difficulty === difficulty);
}

export function getSnippetsByCategory(category: Category): Snippet[] {
  return SNIPPETS.filter(s => s.category === category);
}

export function getAllLanguages(): string[] {
  return Array.from(new Set(SNIPPETS.map(s => s.lang))).sort();
}

export function getRandomSnippet(): Snippet {
  return SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
}
