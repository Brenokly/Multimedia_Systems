package com.media.noesis.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.media.noesis.entities.Clan;
import com.media.noesis.entities.Option;
import com.media.noesis.entities.Question;
import com.media.noesis.entities.Topic;
import com.media.noesis.entities.Unit;
import com.media.noesis.entities.User;
import com.media.noesis.enums.Level;
import com.media.noesis.enums.Role;
import com.media.noesis.repositories.ClanRepository;
import com.media.noesis.repositories.QuestionRepository;
import com.media.noesis.repositories.TopicRepository;
import com.media.noesis.repositories.UnitRepository;
import com.media.noesis.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ClanRepository clanRepository;
    private final UnitRepository unitRepository;
    private final TopicRepository topicRepository;
    private final QuestionRepository questionRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String ADMIN_EMAIL = "admin@noesis.com";
    private static final String GLOBAL_CLAN_JOIN_CODE = "NOESIS-GLOBAL-CLAN-001";
    private static final String GLOBAL_UNIT_NAME = "Jornada do Conhecimento";

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        User systemAdmin = createAdminUser();
        Clan globalClan = createGlobalClan(systemAdmin);
        Unit globalUnit = createGlobalUnit(globalClan);

        Topic topicED1 = createTopic("Estruturas de Dados I");
        Topic topicED2 = createTopic("Estruturas de Dados II");
        Topic topicRedes = createTopic("Redes de Computadores");

        createGlobalQuests(systemAdmin, globalUnit, topicED1, topicED2, topicRedes);
    }

    private User createAdminUser() {
        return userRepository.findByEmail(ADMIN_EMAIL).orElseGet(() -> {
            User adminUser = new User();
            adminUser.setName("Sistema Noesis");
            adminUser.setEmail(ADMIN_EMAIL);
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRole(Role.TEACHER);
            adminUser.setAvatarId(1);
            return userRepository.save(adminUser);
        });
    }

    private Clan createGlobalClan(User owner) {
        return clanRepository.findByJoinCode(GLOBAL_CLAN_JOIN_CODE).orElseGet(() -> {
            Clan clan = new Clan();
            clan.setName("Quests Globais Noesis");
            clan.setJoinCode(GLOBAL_CLAN_JOIN_CODE);
            clan.setOwner(owner);
            return clanRepository.save(clan);
        });
    }

    private Unit createGlobalUnit(Clan clan) {
        return unitRepository.findByNameAndClanId(GLOBAL_UNIT_NAME, clan.getId())
                .orElseGet(() -> {
                    Unit unit = new Unit();
                    unit.setName(GLOBAL_UNIT_NAME);
                    unit.setClan(clan);
                    return unitRepository.save(unit);
                });
    }

    private Topic createTopic(String name) {
        return topicRepository.findByName(name).orElseGet(() -> {
            Topic topic = new Topic();
            topic.setName(name);
            return topicRepository.save(topic);
        });
    }

    private Option createOption(boolean isCorrect, String assertion, String feedback) {
        Option option = new Option();
        option.setCorrect(isCorrect);
        option.setAssertion(assertion);
        option.setFeedback(feedback);
        return option;
    }

    private void createGlobalQuests(User author, Unit unit, Topic topicED1, Topic topicED2, Topic topicRedes) {
        // --- Quests de ED1 ---
        createQuestIfNotFound(
                "Um mago sábio aproxima-se e pergunta: 'Para gerir as minhas poções mágicas por prioridade, que feitiço de estrutura de dados devo usar para acesso rápido à mais potente?'",
                Level.EASY, author, unit, List.of(topicED1),
                List.of(
                        createOption(false, "Encantamento da Lista Ligada", "Errado! Uma Lista Ligada faria o mago perder tempo a procurar!"),
                        createOption(true, "Feitiço do Heap (Fila de Prioridade)", "Correto! O Heap é o feitiço perfeito para encontrar o item mais importante rapidamente!"),
                        createOption(false, "Pergaminho do Array Ordenado", "Negativo! Manter um Array ordenado seria ineficiente a cada nova poção.")
                )
        );
        createQuestIfNotFound(
                "Um anão ferreiro precisa organizar sua pilha de lingotes de ferro. Se ele sempre adiciona e remove lingotes do topo, qual estrutura de dados ele está a usar?",
                Level.MEDIUM, author, unit, List.of(topicED1),
                List.of(
                        createOption(false, "Uma Fila (Queue)", "Incorreto. Numa fila, o primeiro a entrar é o primeiro a sair. Ele não conseguiria pegar o último lingote que colocou."),
                        createOption(false, "Uma Tabela Hash", "Isso serve para buscas rápidas, não para empilhar itens em ordem."),
                        createOption(true, "Uma Pilha (Stack)", "Exato! Uma pilha segue a regra LIFO (Last-In, First-Out), perfeita para a pilha de lingotes do anão.")
                )
        );
        createQuestIfNotFound(
                "Para criar um mapa de teletransporte ultra-rápido entre cidades, qual estrutura de dados oferece a busca, inserção e remoção mais velozes em média?",
                Level.HARD, author, unit, List.of(topicED1),
                List.of(
                        createOption(true, "Tabela Hash (HashMap)", "Brilhante! A Tabela Hash oferece complexidade O(1) em média para todas estas operações, ideal para um mapa mágico!"),
                        createOption(false, "Árvore Binária de Busca", "Uma boa opção, mas a sua performance média de O(log n) é superada pela Tabela Hash."),
                        createOption(false, "Array", "Ineficiente para inserção e remoção no meio do mapa, o que seria um desastre para a rede de teletransporte.")
                )
        );

        // --- Quests de ED2 ---
        createQuestIfNotFound(
                "Um elfo batedor precisa de visitar todos os postos avançados na floresta sem repetir nenhum. Que tipo de travessia num grafo ele deve realizar?",
                Level.EASY, author, unit, List.of(topicED2),
                List.of(
                        createOption(false, "Algoritmo de Dijkstra", "Isso é para encontrar o caminho mais curto, não para visitar todos os postos."),
                        createOption(true, "Busca em Profundidade (DFS) ou Largura (BFS)", "Correto! Ambos os algoritmos são perfeitos para percorrer todos os vértices (postos) de um grafo."),
                        createOption(false, "Algoritmo de Prim", "Este algoritmo serve para criar uma árvore de custo mínimo, não para visitar postos existentes.")
                )
        );
        createQuestIfNotFound(
                "Estás perdido num labirinto mágico! Para encontrar o caminho mais curto até à saída, que poderoso algoritmo de busca em grafos deves invocar?",
                Level.MEDIUM, author, unit, List.of(topicED2),
                List.of(
                        createOption(true, "Algoritmo de Dijkstra", "Exato! Dijkstra é o guia infalível para encontrar o caminho mais curto quando as passagens têm custos diferentes!"),
                        createOption(false, "Busca em Profundidade (DFS)", "Cuidado, aventureiro! A busca em profundidade pode levar-te ao caminho mais longo primeiro."),
                        createOption(false, "Algoritmo de Kruskal", "Isso é para encontrar árvores geradoras mínimas, não o caminho mais curto. Não te ajudará a sair do labirinto!")
                )
        );
        createQuestIfNotFound(
                "Um rei precisa de conectar todos os castelos do seu reino com estradas de menor custo total. Qual algoritmo deve o engenheiro real usar para projetar esta rede?",
                Level.HARD, author, unit, List.of(topicED2),
                List.of(
                        createOption(false, "Algoritmo de Floyd-Warshall", "Este encontra o caminho mais curto entre todos os pares de castelos, o que seria um exagero de custos."),
                        createOption(true, "Algoritmo de Prim ou Kruskal", "Perfeito! Ambos são algoritmos gulosos que criam uma Árvore Geradora Mínima, garantindo que todos os castelos sejam conectados com o menor custo total de estradas."),
                        createOption(false, "Ordenação Topológica", "Isso serve para ordenar tarefas com dependências, não para construir estradas.")
                )
        );

        // --- Quests de REDES ---
        createQuestIfNotFound(
                "Um mensageiro real precisa de entregar uma carta secreta (pacote de dados) ao castelo vizinho. Que protocolo garante que a carta chegue intacta e na ordem correta, pedindo reenvio se partes se perderem?",
                Level.EASY, author, unit, List.of(topicRedes),
                List.of(
                        createOption(false, "Protocolo UDP (Pombo-correio Rápido)", "Arriscado! O UDP é rápido, mas não garante a entrega nem a ordem. A tua mensagem pode chegar incompleta!"),
                        createOption(false, "Protocolo IP (Endereçamento Real)", "O IP apenas indica o endereço, mas não se responsabiliza pela entrega confiável da mensagem."),
                        createOption(true, "Protocolo TCP (Carruagem Real Confiável)", "Perfeito! O TCP estabelece uma conexão segura, verifica a entrega e garante que todas as partes da mensagem cheguem em ordem.")
                )
        );
        createQuestIfNotFound(
                "Para traduzir o nome de um domínio arcano (como 'castelo-do-sol.com') para o seu endereço mágico (endereço IP), que serviço do reino da internet é consultado?",
                Level.MEDIUM, author, unit, List.of(topicRedes),
                List.of(
                        createOption(true, "DNS (Domain Name System)", "Correto! O DNS funciona como a grande biblioteca de nomes do reino, traduzindo nomes legíveis para endereços IP."),
                        createOption(false, "DHCP (Dynamic Host Configuration Protocol)", "O DHCP é responsável por atribuir endereços IP aos dispositivos quando eles se conectam à rede, não por traduzir nomes."),
                        createOption(false, "HTTP (HyperText Transfer Protocol)", "O HTTP é o protocolo para requisitar as páginas e recursos, mas ele precisa do endereço IP (obtido via DNS) para saber onde fazer a requisição.")
                )
        );
        createQuestIfNotFound(
                "Um espião tenta intercetar mensagens entre dois reinos. Que camada do modelo OSI é responsável pela criptografia dos dados para garantir a confidencialidade da comunicação?",
                Level.HARD, author, unit, List.of(topicRedes),
                List.of(
                        createOption(false, "Camada de Rede (Network Layer)", "Esta camada lida com o roteamento dos pacotes, mas não com a sua criptografia."),
                        createOption(true, "Camada de Apresentação (Presentation Layer)", "Exato! A Camada 6, de Apresentação, é responsável por traduzir, comprimir e, crucialmente, criptografar os dados para que a camada de Aplicação os entenda de forma segura."),
                        createOption(false, "Camada de Enlace (Data Link Layer)", "Esta camada lida com a transmissão de frames na rede local, mas a criptografia ponta a ponta acontece em camadas superiores.")
                )
        );
    }

    private void createQuestIfNotFound(String statement, Level level, User author, Unit unit, List<Topic> topics, List<Option> options) {
        questionRepository.findByStatement(statement).ifPresentOrElse(
                q -> {
                }, // Se a questão já existe, não faz nada.
                () -> {
                    Question question = new Question();
                    question.setStatement(statement);
                    question.setLevel(level);
                    question.setAuthor(author);
                    question.setUnit(unit);
                    question.setTopics(topics);

                    options.forEach(option -> option.setQuestion(question));
                    question.setOptions(options);

                    questionRepository.save(question);
                }
        );
    }
}
