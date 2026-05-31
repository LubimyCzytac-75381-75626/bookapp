package pl.vistula.bookapp.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import pl.vistula.bookapp.jpa.model.Author;

import pl.vistula.bookapp.jpa.repository.AuthorRepository;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@Slf4j
@RequestMapping("/author")
public class AuthorController {

    @Autowired
    private AuthorRepository authorRepository;

    @GetMapping("/")
    List<Author> list() {
        log.info("Getting list of authors");

        return authorRepository.findAll();
    }

    @PostMapping("/save")
    public Author save(@RequestBody Author author) {
        log.info("Saving author: {}", author);

        return authorRepository.save(author);
    }

    @GetMapping("/{id}")
    ResponseEntity<Author> get(@PathVariable Long id) {
        log.info("Getting author with id: {}", id);
        return authorRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    void delete(@PathVariable Long id) {
        log.info("Deleting author with id: {}", id);
        authorRepository.deleteById(id);
    }

  }
