fun main() {
    println("Hello, World!")
}

class Person(val name: String, var age: Int) {
    fun greet() {
        println("Hello, my name is $name and I am $age years old.")
    }
    
    override fun toString(): String {
        return "Person(name='$name', age=$age)"
    }
}
