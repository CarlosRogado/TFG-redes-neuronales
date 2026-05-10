# La base de las redes neuronales
## ¿Qué es una red neuronal?
Es un modelo de la inteligencia artificial que enseña a los computadoras a procesar datos de una manera similar a como lo hace el cerebro humano. Estos aprenden a base de prueba y error, logrando una mejora continua.

Consiste en un tipo de proceso de ["Machine learning"](#qué-es-el-machine-learnign-y-que-tipos-existen) llamado [Deep learning](#qué-es-el-aprendizaje-profundo-o-deep-learning), que utiliza neuronas interconectadas entre sí en una estructura de capas parecidas al cerebro humano, las cuales procesan información de forma no lineal mediante el uso de [funciones de activación](#funciones-de-activación). Estas funciones permiten que la red transforme números simples en decisiones, permitiendo aprender patrones.

En esta aplicación cada "cohete" es una red neuronal independiente, capaz de decidir si saltar o no. Los datos que recibe (inputs) son la distancia al objetivo, la velocidad actual, el ángulo de inclinación y la distancia a obstáculos, y como resultado proporciona un número entre 0 y 1, si este número es más grande que 0.5 el "cohete" realiza un salto, si no lo es el cohete se queda parado.

## Funcionamiento de las redes neuronales.
Está inspirado en el cerebro humano, una red neuronal esta formada por un conjunto de neuronas artificiales (llamadas nodos) que trabajan juntas para resolver un problema.

### Su arquitectura esta formada por tres capas:
#### 1. Capa de entrada
La información entra a la red neuronal artificial desde esta capa, las neuronas que se encuentran en ella procesan los datos, los analizan y los pasan a la siguiente capa.

#### 2. Capa oculta 
Las redes pueden tener infinitas capas de este tipo, cada capa oculta analiza la salida de la capa anterior, la procesa aun más y pasa los datos a la siguiente capa.

#### 3. Capa de salida 
Proporciona el resultado final de todo el procesamiento de datos realizado. Puede estar compuesta por una o varias neuronas dependiendo del tipo de problema que este intentando resolver.

## Tipos de redes neuronales
Los tipos de redes neuronales dependen de cómo fluyen los datos desde la capa de entrada hasta la capa de salida. Se pueden distinguir los siguientes tipos:

### Redes neuronales prealimentadas o perceptrón multicapa (Feedforward)
Procesan datos en una dirección, desde la capa de entrada hasta la capa de salida. Todos los nodos de una capa están conectados a todos los nodos de la siguiente capa. Utiliza un proceso de retroalimentación para mejorar las predicciones a lo largo del tiempo.

(Utilizado en la simulación)

### Redes neuronales convolucionales
Las capas ocultas de estas redes realizan funciones matemáticas específicas, utilizadas para clasificación de imágenes ya que pueden obtener características de estas útiles para su reconocimiento y clasificación.

## ¿Qué es el Machine learning y qué tipos existen?
El **machine learning (ML)** es un subconjunto de la informática, la ciencia de datos y la inteligencia artificial que permite a los sistemas aprender y mejorar a partir de datos sin intervenciones adicionales de programación.

Los modelos de machine learning estan basados en algoritmos y modelos estadísticos que implementan tareas basadas en patrones de datos e inferencias. Su función es utilizar los datos de entrada para predecir los datos de salida, actualizandolos continuamente a medida que se dispone de nuevos datos.

### Aprendizaje supervisado
El usuario proporciona a los modelos conjuntos de datos etiquetados que ofrecen la respuesta correcta por adelantado. La red neuronal aprende lentamente a base de prueba y error mediante la respuesta correcta.

### Aprendizaje no supervisado
Los modelos extraen conclusiones de conjuntos de datos no etiquetados, lo que facilita el análisis de estos y permite el reconocimiento de patrones y el modelado predictivo.

### Aprendizaje autosupervisado
Permite a los modelos entrenarse con datos no etiquetados, se implementan algoritmos predictivos o de pretexto permitiendo que se genere automáticamente etiquetas y transformando los problemas no supervisados en supervisados. Suele utilizarse para trabajos donde el volumen de datos es masivo.

### Aprendizaje por refuerzo
Entrenan modelos mediante un sistema de recompensa y castigo. Se requiere de un entorno en específico para alcanzar un objetivo predeterminado. Este tipo de aprendizaje suele utilizarse en desarrollo de videojuegos o enseñar a robots a realizar tareas.
(Utilizado en la simulación)

### Aprendizaje semisupervisada
Se trata de una combinación de algoritmo supervisado y no supervisado. Entrenados con un conjunto de datos etiquetados, encargados de guiar el proceso de aprendizaje y un gran conjunto sin etiquetar. 

## ¿Qué es el aprendizaje profundo o Deep learning?
Es un subconjunto de machine learning impulsado por redes neuronales cuyo diseño se inspira en la estructura del cerebro humano. Estos modelos constan de muchas capas interconectadas de ["neuronas"](#qué-es-una-neurona), que realizan operaciones matemáticas mediante el uso de [Machine learning](#qué-es-el-machine-learning-y-qué-tipos-existen) para ajustar la fuerza de las conexiones entre las neuronas individuales de las capas adyacentes.

### ¿Qué es una neurona?
Una **neurona** es una unidad básica de procesamiento de información en una red neuronal, simula el funcionamiento biológico del cerebro.

Esta recibe unos datos de entrada, les asigna un [peso](#qué-son-los-pesos-y-sesgos-en-redes-neuronales) según su importancia, aplica una suma ponderada y genera una salida mediante una función de activación permitiendo a las máquinas reconocer patrones y tomar decisiones.

#### ¿Qué son los pesos y sesgos en redes neuronales?
Los **pesos** son multiplicadores numéricos que determinan la importancia de la conexión entre las neuronas, un peso alto significa que la señal de esa conexión tiene una gran influencia y un peso bajo implica poca influencia. Cada conexión entre dos neuronas tiene asociado un peso. 

Estos son clave en el aprendizaje de la simulación ya que al principio serán aleatorios, pero a medida que la simulación avance, se clonarán los mejores individuos permitiendo tener su peso de referencia.

Los **sesgos** son valores adicionales que se suman a la suma ponderada de las entradas que recibe una neurona, es una entrada constante adicional que permite que la función de activación de la neurona se dispare lo que significa que la neurona se activa.

#### Las funciones de activación.
Las funciones de activación son el mecanismo de decisión de las redes neuronales. Se encargan de transformar el número resultante de una suma ponderada en un formato específico. Un ejemplo práctico para entenderlo mejor. Las principales son:

- **Sigmoide**: Transforma números en probabilidades dando resultados entre 0 y 1, usada especialmente en modelos en los que tenemos que predecir la probabilidad de algo.

$$ a= \frac{1}{1+exp(-z)} $$

- **Tanh**: Igual que la función Sigmoid pero devuelve valores entre -1 y 1. La ventaja que propociona esta función es que ayuda a la red a separar conceptos que son contrarios.
 
$$ a= \frac{e^z - e^{-z}}{e^z + e^{-z}}$$

- **Relu**: Filtra los resultados permitiendo pasar los números positivos tal cual están pero los negativos se convierten automáticamente en 0. Se utiliza principalmente en capas ocultas para que el sistema aprenda rápido y no sature, otorgando eficiencia.

$$ f(x) = \max(0,x) = \begin{cases} 0 & \text{si } x < 0 \\ x & \text{si } x \geq 0 \end{cases} $$

- **Softmax**, es exclusiva de la capa de salida y necesita al menos 2 opciones para comparar y repartir el porcentaje entre ellas. Toma un grupo de números y los convierte en una distribucción que suman 1 (100%).
